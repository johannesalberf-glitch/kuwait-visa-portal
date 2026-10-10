CREATE TABLE public.visas (
  id TEXT PRIMARY KEY,
  tracker TEXT NOT NULL,
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.visas TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.visas TO authenticated;
GRANT ALL ON public.visas TO service_role;

ALTER TABLE public.visas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert visa records"
  ON public.visas FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can look up visas"
  ON public.visas FOR SELECT
  TO anon, authenticated
  USING (true);