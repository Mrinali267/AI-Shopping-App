# Deployment guide

**Author: Mrinali**

## Hosting layout

Use two Vercel projects from this repository: one for the Next.js frontend (`frontend/`) and one for the FastAPI API (`backend/`). Use Supabase Postgres for durable data. The frontend's Vercel deployment alone is not enough: the API and database must also be deployed and configured.

Vercel's Python runtime supports FastAPI applications and recognizes `backend/app/main.py` when the API project's root directory is `backend`. The runtime is currently Python 3.12 by default; this project supports Python 3.13. Complete the configuration below and check deployment logs on the first deploy.

## Supabase database

1. Create a Supabase project and choose a strong database password in Supabase's setup flow. Save the password in your password manager.
2. In Supabase, open **Connect** and copy a PostgreSQL connection string. This project uses psycopg 3, so set the SQLAlchemy URL scheme to `postgresql+psycopg://` (instead of `postgresql://`) and keep the password URL-encoded if it contains reserved URL characters. Prefer the session pooler if the direct database connection is unavailable from serverless functions.
3. Keep the connection string private. Add it only as the backend project's `DATABASE_URL` environment variable in Vercel.
4. Initialize the schema and product catalog against the Supabase database. From the `backend/` directory, with `DATABASE_URL` set to the Supabase connection string, run:

   ```bash
   python scripts/seed.py
   ```

   This script creates missing tables, applies the app's additive schema updates, and upserts the catalog. In production mode, it does not create the development-only demo buyer and merchant. Run it once when preparing the database, then deploy the API.

## Vercel frontend project

1. Import the GitHub repository into Vercel and create a project with **Root Directory** set to `frontend`.
2. Keep the Next.js framework preset and the default `npm run build` command.
3. Set `NEXT_PUBLIC_API_URL` to the public HTTPS origin of the backend Vercel project, for example `https://your-api.vercel.app`. This value is embedded in the frontend at build time; redeploy after changing it.
4. Deploy the frontend and record its canonical origin, for example `https://your-app.vercel.app`.

## Vercel API project

1. Import the same GitHub repository again as a second Vercel project, with **Root Directory** set to `backend`.
2. Vercel should auto-detect FastAPI from `app/main.py` under the configured `backend` root. Leave the build command and output directory unset unless Vercel's import flow requires a value. Confirm the deployment exposes the application routes and `/health` before sending production traffic.
3. Add these environment variables to the backend project:

   - `DATABASE_URL` — private Supabase PostgreSQL connection string.
   - `FRONTEND_URL` — exact public frontend origin, without a trailing slash.
   - `APP_ENV=production`.
   - `JWT_SECRET_KEY` — a new, randomly generated secret.
   - `NVIDIA_API_KEY` — if live assistant responses are required.
   - `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` — if hosted test-mode checkout is required.
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` — if Google sign-in is required.

   Never put secrets in a `NEXT_PUBLIC_*` variable. Add secrets only in the backend project's Vercel environment settings. Do not commit `.env` files.

4. Set `NEXT_PUBLIC_API_URL` in the frontend project to the API's final HTTPS origin, then redeploy the frontend.

## OAuth and payment callbacks

If Google sign-in is enabled, add this authorized redirect URI to the Google OAuth client:

```text
https://<api-vercel-domain>/api/auth/google/callback
```

Use the exact production frontend origin for `FRONTEND_URL`. Configure payment provider callback/webhook URLs only after checking the routes and signature requirements in the provider dashboard and this API.

## First-deploy checks

1. Open `https://<api-vercel-domain>/health` and confirm the API reports healthy.
2. Open the frontend and confirm catalog data loads from the API.
3. Check Vercel function logs for database connection or Python dependency errors.
4. Verify Google sign-in if configured.
5. Verify test-mode checkout only after adding the payment credentials and configuring provider callbacks.
6. Confirm browser requests use the public API origin over HTTPS.

## GitHub

The repository is available at [Mrinali267/AI-Shopping-App](https://github.com/Mrinali267/AI-Shopping-App). Vercel can import it directly. Keep credentials, database files, and local environment files out of Git.
