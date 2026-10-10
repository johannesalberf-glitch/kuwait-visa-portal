-- Lock down visas table: no direct client access.
-- All reads/writes go through server functions using the service role.
DROP POLICY IF EXISTS "Public can look up visas" ON public.visas;
DROP POLICY IF EXISTS "Public can insert visa records" ON public.visas;
DROP POLICY IF EXISTS "Public can update visa records" ON public.visas;
DROP POLICY IF EXISTS "Public can delete visa records" ON public.visas;

-- Deny-all policies. Service role (used by server functions) bypasses RLS.
CREATE POLICY "Deny all direct access - select" ON public.visas FOR SELECT USING (false);
CREATE POLICY "Deny all direct access - insert" ON public.visas FOR INSERT WITH CHECK (false);
CREATE POLICY "Deny all direct access - update" ON public.visas FOR UPDATE USING (false) WITH CHECK (false);
CREATE POLICY "Deny all direct access - delete" ON public.visas FOR DELETE USING (false);