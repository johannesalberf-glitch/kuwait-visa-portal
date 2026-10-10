REVOKE EXECUTE ON FUNCTION public.purge_old_visa_media() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.purge_old_visa_media() TO postgres;