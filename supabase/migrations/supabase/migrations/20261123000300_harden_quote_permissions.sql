-- Incremental hardening of the MVP quote flow.
-- The 001 and 002 migrations already applied to shared environments are preserved.

-- Requests can only be created by customers as waiting requests.
DROP POLICY IF EXISTS "Customers can create their requests" ON public.quote_requests;
CREATE POLICY "Customers can create their requests"
ON public.quote_requests
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = customer_id
    AND status = 'waiting'
    AND length(trim(category)) > 0
    AND length(trim(description)) > 0
    AND EXISTS (
        SELECT 1
        FROM public.profiles customer_profile
        WHERE customer_profile.id = auth.uid()
          AND customer_profile.role = 'customer'
    )
);

-- Professionals may only update their assigned requests, and only the status.
DROP POLICY IF EXISTS "Professionals can update received requests" ON public.quote_requests;
CREATE POLICY "Professionals can update received requests"
ON public.quote_requests
FOR UPDATE
TO authenticated
USING (
    auth.uid() = professional_id
)
WITH CHECK (
    auth.uid() = professional_id
);

-- The trigger provides database-level protection even if a client bypasses the UI.
CREATE OR REPLACE FUNCTION public.protect_quote_request_mutations()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    IF NEW.customer_id IS DISTINCT FROM OLD.customer_id
       OR NEW.professional_id IS DISTINCT FROM OLD.professional_id
       OR NEW.category IS DISTINCT FROM OLD.category
       OR NEW.description IS DISTINCT FROM OLD.description
       OR NEW.created_at IS DISTINCT FROM OLD.created_at
    THEN
        RAISE EXCEPTION 'Quote request ownership and content are immutable';
    END IF;

    IF NEW.status IS DISTINCT FROM OLD.status
       AND NOT (
           NEW.status = 'proposal_sent'
           AND OLD.status = 'waiting'
       )
    THEN
        RAISE EXCEPTION 'Invalid quote request status transition';
    END IF;

    IF NEW.status = 'proposal_sent'
       AND NOT EXISTS (
           SELECT 1
           FROM public.quote_proposals
           WHERE request_id = NEW.id
             AND professional_id = NEW.professional_id
             AND customer_id = NEW.customer_id
       )
    THEN
        RAISE EXCEPTION 'A proposal is required before marking the request as proposal_sent';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_quote_request_mutations ON public.quote_requests;
CREATE TRIGGER protect_quote_request_mutations
BEFORE UPDATE ON public.quote_requests
FOR EACH ROW
EXECUTE FUNCTION public.protect_quote_request_mutations();

-- Restrict direct table privileges to controlled columns.
REVOKE INSERT, UPDATE ON public.quote_requests FROM authenticated;
GRANT INSERT (customer_id, professional_id, category, description, status)
ON public.quote_requests TO authenticated;
GRANT UPDATE (status) ON public.quote_requests TO authenticated;

-- Proposal inserts are restricted to the assigned participant and request.
DROP POLICY IF EXISTS "Professionals can send proposals" ON public.quote_proposals;
CREATE POLICY "Professionals can send proposals"
ON public.quote_proposals
FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = professional_id
    AND amount >= 0
    AND length(trim(message)) > 0
    AND EXISTS (
        SELECT 1
        FROM public.quote_requests request
        WHERE request.id = request_id
          AND request.professional_id = auth.uid()
          AND request.customer_id = quote_proposals.customer_id
          AND request.status = 'waiting'
    )
);

REVOKE INSERT, UPDATE ON public.quote_proposals FROM authenticated;
GRANT INSERT (request_id, professional_id, customer_id, amount, message)
ON public.quote_proposals TO authenticated;

-- Keep proposal records immutable after creation.
CREATE OR REPLACE FUNCTION public.prevent_quote_proposal_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    RAISE EXCEPTION 'Quote proposals are immutable';
END;
$$;

DROP TRIGGER IF EXISTS protect_quote_proposal_mutations ON public.quote_proposals;
CREATE TRIGGER protect_quote_proposal_mutations
BEFORE UPDATE OR DELETE ON public.quote_proposals
FOR EACH ROW
EXECUTE FUNCTION public.prevent_quote_proposal_changes();
