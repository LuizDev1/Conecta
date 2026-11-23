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

DROP POLICY IF EXISTS "Authenticated users can discover professionals" ON public.profiles;
CREATE POLICY "Authenticated users can discover professionals"
ON public.profiles
FOR SELECT
TO authenticated
USING (role = 'professional' AND is_available = TRUE);

DROP POLICY IF EXISTS "Visitors can discover professionals" ON public.profiles;
CREATE POLICY "Visitors can discover professionals"
ON public.profiles
FOR SELECT
TO anon
USING (role = 'professional' AND is_available = TRUE);

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

DROP POLICY IF EXISTS "Customers can create their requests" ON public.quote_requests;
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

DROP POLICY IF EXISTS "Participants can view their requests" ON public.quote_requests;
CREATE POLICY "Participants can view their requests"
ON public.quote_requests
FOR SELECT
TO authenticated
USING (
    auth.uid() = customer_id
    OR auth.uid() = professional_id
);

DROP POLICY IF EXISTS "Professionals can update received requests" ON public.quote_requests;
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

CREATE TABLE IF NOT EXISTS public.quote_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES public.quote_requests(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_quote_proposals_request
    ON public.quote_proposals(request_id);

ALTER TABLE public.quote_proposals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Professionals can send proposals" ON public.quote_proposals;
CREATE POLICY "Professionals can send proposals"
ON public.quote_proposals
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = professional_id
    AND EXISTS (
        SELECT 1
        FROM public.quote_requests request
        WHERE request.id = request_id
          AND request.professional_id = auth.uid()
          AND request.customer_id = quote_proposals.customer_id
    )
);

DROP POLICY IF EXISTS "Participants can view proposals" ON public.quote_proposals;
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

GRANT SELECT ON public.profiles TO anon;
GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (
    full_name,
    presentation,
    description,
    specialties,
    service_categories,
    service_area,
    phone,
    city,
    is_available
) ON public.profiles TO authenticated;

GRANT SELECT, INSERT, UPDATE ON public.quote_requests TO authenticated;
GRANT SELECT, INSERT ON public.quote_proposals TO authenticated;
