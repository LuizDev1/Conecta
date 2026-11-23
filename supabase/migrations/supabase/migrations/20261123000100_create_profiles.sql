
-- =====================================================
-- CONECTA - MIGRATION 001
-- Criação da tabela de perfis
-- =====================================================

-- 1. Tabela de perfis
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('customer', 'professional')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Habilita Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Usuários podem consultar apenas o próprio perfil
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- 4. Usuários podem atualizar apenas o próprio perfil
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 5. Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_profile_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_updated
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_profile_updated_at();

-- 6. Impede alteração da função do usuário
CREATE OR REPLACE FUNCTION public.prevent_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        RAISE EXCEPTION 'Users cannot change their own role';
    END IF;

    RETURN NEW;
END;
$$;

CREATE TRIGGER prevent_profile_role_change
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_role_change();

-- 7. Função para criar perfil automaticamente após cadastro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
        COALESCE(NEW.raw_user_meta_data ->> 'role', 'customer')
    );

    RETURN NEW;
END;
$$;

-- 8. Trigger de criação automática do perfil
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- 9. Permissões para usuários autenticados
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

REVOKE UPDATE ON public.profiles FROM authenticated;

GRANT UPDATE (full_name) ON public.profiles TO authenticated;

-- =====================================================
-- CONECTA - MIGRATION 002
-- MVP: profissionais, solicitações e propostas
-- =====================================================

ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS presentation TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS specialties TEXT[] NOT NULL DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS service_categories TEXT[] NOT NULL DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS service_area TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS phone TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS city TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS is_available BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT FALSE;

-- Profissionais podem ser descobertos por usuários autenticados.
CREATE POLICY "Authenticated users can discover professionals"
ON public.profiles
FOR SELECT
TO authenticated
USING (role = 'professional' AND is_available = TRUE);

CREATE POLICY "Visitors can discover professionals"
ON public.profiles
FOR SELECT
TO anon
USING (role = 'professional' AND is_available = TRUE);

-- Solicitações de orçamento
CREATE TABLE IF NOT EXISTS public.quote_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'waiting'
        CHECK (status IN ('waiting', 'proposal_sent', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can create their requests"
ON public.quote_requests
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = customer_id
    AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'customer'
    )
);

CREATE POLICY "Participants can view their requests"
ON public.quote_requests
FOR SELECT
TO authenticated
USING (
    auth.uid() = customer_id
    OR auth.uid() = professional_id
);

-- O profissional também pode cancelar ou atualizar o estado da solicitação.
CREATE POLICY "Professionals can update received requests"
ON public.quote_requests
FOR UPDATE
TO authenticated
USING (auth.uid() = professional_id)
WITH CHECK (auth.uid() = professional_id);

CREATE OR REPLACE FUNCTION public.handle_quote_request_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_quote_request_updated ON public.quote_requests;
CREATE TRIGGER on_quote_request_updated
BEFORE UPDATE ON public.quote_requests
FOR EACH ROW
EXECUTE FUNCTION public.handle_quote_request_updated_at();

-- Propostas enviadas pelos profissionais
CREATE TABLE IF NOT EXISTS public.quote_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.quote_requests(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.quote_proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals can send proposals"
ON public.quote_proposals
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = professional_id
    AND EXISTS (
        SELECT 1
        FROM public.quote_requests
        WHERE id = request_id
          AND professional_id = auth.uid()
          AND customer_id = quote_proposals.customer_id
    )
);

CREATE POLICY "Participants can view proposals"
ON public.quote_proposals
FOR SELECT
TO authenticated
USING (
    auth.uid() = professional_id
    OR auth.uid() = customer_id
);

CREATE OR REPLACE FUNCTION public.handle_quote_proposal_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    UPDATE public.quote_requests
    SET status = 'proposal_sent',
        updated_at = NOW()
    WHERE id = NEW.request_id
      AND professional_id = NEW.professional_id
      AND customer_id = NEW.customer_id;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_quote_proposal_created ON public.quote_proposals;
CREATE TRIGGER on_quote_proposal_created
AFTER INSERT ON public.quote_proposals
FOR EACH ROW
EXECUTE FUNCTION public.handle_quote_proposal_created();

CREATE INDEX IF NOT EXISTS idx_profiles_role_available
    ON public.profiles(role, is_available);

CREATE INDEX IF NOT EXISTS idx_quote_requests_customer
    ON public.quote_requests(customer_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_quote_requests_professional
    ON public.quote_requests(professional_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_quote_proposals_request
    ON public.quote_proposals(request_id);

GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (full_name, presentation, description, specialties,
    service_categories, service_area, phone, city, is_available)
ON public.profiles TO authenticated;

GRANT SELECT, INSERT, UPDATE ON public.quote_requests TO authenticated;
GRANT SELECT, INSERT ON public.quote_proposals TO authenticated;
