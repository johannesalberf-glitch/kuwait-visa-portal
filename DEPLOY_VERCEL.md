# Deploying to Vercel

## 1. Environment variables (Vercel → Settings → Environment Variables)

Required:

- `ADMIN_PASSWORD` — password for the `/admin` login (username is always `admin`)
- `VITE_SUPABASE_URL` — copy from `.env`
- `VITE_SUPABASE_PUBLISHABLE_KEY` — copy from `.env`
- `VITE_SUPABASE_PROJECT_ID` — copy from `.env`
- `SUPABASE_URL` — same value as `VITE_SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY` — same value as `VITE_SUPABASE_PUBLISHABLE_KEY`

Add all of these for **Production**, **Preview**, and **Development**.

## 2. Build settings

- Framework preset: **Other**
- Build command: `npm run build`
- Output directory: leave empty (Nitro auto-configures for Vercel)
- Install command: `npm install`

Nitro auto-detects Vercel and outputs the correct serverless function bundle — no extra preset config needed.

## 3. Deploy

Push to GitHub and import the repo in Vercel, or run `vercel --prod` from the project root.

## 4. Test after deploy

- **Public page** — `https://<your-app>.vercel.app/` — enter a saved OTP number, the visa card should appear.
- **Admin** — `https://<your-app>.vercel.app/admin` — login form appears. Sign in with `admin` + your `ADMIN_PASSWORD`. Create a visa; it saves to Supabase and is immediately searchable from any browser on `/`.
- **Images** — all ministry / news / emblem images load from `/images/*` in the deployed bundle, no dependency on Lovable CDN.

## Notes

- Visa records live in Supabase (Lovable Cloud), which works cross-browser and cross-device out of the box. No Upstash / Redis needed.
- If you rotate `ADMIN_PASSWORD`, existing admin sessions are invalidated automatically (the session key is derived from the password).
