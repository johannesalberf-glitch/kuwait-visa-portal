-- ==============================================================================
-- Kuwait Visa Portal - Supabase Cloud Database Initialization
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Create visas table
CREATE TABLE IF NOT EXISTS public.visas (
  id TEXT PRIMARY KEY,
  tracker TEXT,
  name TEXT NOT NULL,
  passport TEXT NOT NULL,
  nationality TEXT NOT NULL,
  gender TEXT NOT NULL,
  visa_type TEXT NOT NULL,
  occupation TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  expiry_date TEXT NOT NULL,
  photo TEXT,
  documents JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'APPROVED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.visas ENABLE ROW LEVEL SECURITY;

-- 3. Clear old restrictive policies
DROP POLICY IF EXISTS "Public can look up visas" ON public.visas;
DROP POLICY IF EXISTS "Public can insert visa records" ON public.visas;
DROP POLICY IF EXISTS "Public can update visa records" ON public.visas;
DROP POLICY IF EXISTS "Public can delete visa records" ON public.visas;
DROP POLICY IF EXISTS "Deny all direct access - select" ON public.visas;
DROP POLICY IF EXISTS "Deny all direct access - insert" ON public.visas;
DROP POLICY IF EXISTS "Deny all direct access - update" ON public.visas;
DROP POLICY IF EXISTS "Deny all direct access - delete" ON public.visas;
DROP POLICY IF EXISTS "Allow all operations on visas" ON public.visas;

-- 4. Allow full access so both anon public key and service_role key can read & write
CREATE POLICY "Allow all operations on visas"
  ON public.visas
  FOR ALL
  TO anon, authenticated, service_role
  USING (true)
  WITH CHECK (true);

-- 5. Grant permissions to roles
GRANT ALL ON public.visas TO anon, authenticated, service_role;
