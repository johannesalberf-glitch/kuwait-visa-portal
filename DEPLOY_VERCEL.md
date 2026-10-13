# Deploying to Vercel

## 1. Cloud Database Setup (Supabase)
To make newly generated visas visible across all phones and devices:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** → Click **New Query** → Paste the entire content of `SUPABASE_SETUP.sql` from this repository → Click **Run**.
3. Go to **Project Settings** → **API**:
   - Copy **Project URL** (e.g. `https://xyzcompany.supabase.co`)
   - Copy **service_role secret key** (or anon key)

## 2. Environment Variables in Vercel
Go to **Vercel** → Your Project → **Settings** → **Environment Variables**:

Add these variables for **Production**, **Preview**, and **Development**:
- `ADMIN_PASSWORD` — password for `/admin` (e.g. `admin1234admin`)
- `SUPABASE_URL` — your Supabase Project URL
- `SUPABASE_SERVICE_ROLE_KEY` — your Supabase secret key (or anon public key)

*(Optional aliases also supported automatically: `VITE_SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_ANON_KEY`, `SUPABASE_PUBLISHABLE_KEY`)*

## 3. Build Settings

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
