# Deploying Kuwait Visa Portal

## 1. Environment Variables
Optional environment variable:
- `ADMIN_PASSWORD` — password for `/admin` (defaults to `admin1234admin` if not set)

## 2. Build Settings
- Build command: `npm run build`
- Install command: `npm install`

## 3. How It Works
- **Admin Portal (`/admin`)**: Sign in with username `admin` and password `admin1234admin` (or your `ADMIN_PASSWORD`). Create a new user visa record to generate a 6-digit **OTP Code** and 6-digit **Tracking Code**.
- **Public Verification (`/`)**: Enter either the **OTP Code**, **Tracking Code**, or **Passport Number** in the Electronic Visa & Code Tracker to display the official user visa information and eVisa card.
