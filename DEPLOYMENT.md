# Deployment guide

**Author: Mrinali**

## Hosting plan

Deploy `frontend/` to Vercel as a Next.js application. Deploy `backend/` separately as a FastAPI container and point it at a persistent PostgreSQL database. The backend stores orders, users, carts, campaigns, and audit data; a serverless frontend deployment does not provide durable storage for this API.

## Vercel frontend

1. Create a new Git repository under an account you control and push this project to it.
2. Import that repository into Vercel.
3. Set **Root Directory** to `frontend` and keep the Next.js framework preset and default build command (`npm run build`).
4. Add `NEXT_PUBLIC_API_URL` with the public HTTPS origin of the deployed API, for example `https://api.example.com`. This value is embedded into the frontend at build time, so set it before building and redeploy after changing it.
5. Deploy, then use the final Vercel domain as `FRONTEND_URL` in the API environment.

Do not add model, payment, OAuth, database, or JWT secrets to Vercel's `NEXT_PUBLIC_*` variables. The frontend only needs the public API URL.

## API service

Use a host that can run the `backend/Dockerfile` container, expose port `8842`, and provide persistent database connectivity. Set the following in that host's secret/environment settings:

- `DATABASE_URL` — managed PostgreSQL URL for production.
- `FRONTEND_URL` — exact public frontend origin, such as `https://your-app.vercel.app` (no trailing slash).
- `APP_ENV=production`.
- `JWT_SECRET_KEY` — a fresh, randomly generated value.
- `NVIDIA_API_KEY` — if live assistant responses are required.
- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` — if hosted test-mode checkout is required.
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` — if Google sign-in is required.

The local SQLite configuration is for development only. Use the database provider's supported PostgreSQL URL format. Do not rely on a container's writable filesystem for the production database.

## OAuth and browser access

Configure the Google OAuth client with the callback URL for the public API host:

```text
https://<api-host>/api/auth/google/callback
```

The API's CORS and login redirect configuration uses `FRONTEND_URL`; update it to the final Vercel origin before verifying sign-in. If you use a custom domain, use that same canonical origin in both places. Preview deployments may need their own API environment because the backend accepts a configured frontend origin.

## Smoke check after deployment

1. Open `https://<api-host>/health` and confirm the API reports healthy.
2. Open the Vercel site and confirm product data loads from the API.
3. Verify Google sign-in if configured.
4. Verify a test-mode checkout only after adding the payment credentials to the API host.
5. Confirm the browser's network requests go to the public API origin over HTTPS.

## Git remote

The local Git remote has been removed. After creating a repository under the intended owner, connect it with:

```bash
git remote add origin <your-repository-url>
git push -u origin main
```

Review the staged files before the first push. Keep local `.env` files, database files, and credentials out of Git.
