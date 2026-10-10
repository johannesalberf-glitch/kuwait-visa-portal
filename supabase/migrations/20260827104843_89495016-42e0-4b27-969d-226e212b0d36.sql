CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.purge_old_visa_media()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.visas
  SET photo = NULL,
      documents = '[]'::jsonb
  WHERE created_at < now() - interval '30 days'
    AND (photo IS NOT NULL OR documents IS DISTINCT FROM '[]'::jsonb);
$$;

SELECT public.purge_old_visa_media();

SELECT cron.unschedule('purge-old-visa-media')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'purge-old-visa-media');

SELECT cron.schedule(
  'purge-old-visa-media',
  '0 3 * * *',
  $$SELECT public.purge_old_visa_media();$$
);