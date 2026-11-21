# AI Shopping app

**Author: Mrinali**

AI Shopping app is a demo commerce platform with two connected experiences:

- **AI Shopping app** — a storefront where people can shop with an AI assistant, manage a cart, and complete checkout.
- **AI Merchant growth** — merchant dashboards for demand signals, product opportunities, campaigns, orders, and audit history.

The AI proposes shopping actions. A deterministic policy layer checks them against product availability, budgets, and spending limits before they can affect a cart or order. Checkout continues to use the existing payment gateway integration in test mode.

## Project layout

| Path | Purpose |
|---|---|
| `frontend/` | Next.js storefront and merchant interface |
| `backend/` | FastAPI API, policy engine, agent, and database models |
| `integration-demo/` | Small external-client storefront example |
| `buyer_agent/` | Scripted API client |
| `campaigns/` | Campaign runner and generated results |
| `eval/` | Safety evaluation runner and results |

## Run locally with Docker

Install Docker Desktop, copy `.env.example` to `.env`, and add the credentials needed for the features you want to try. Then run:

```bash
docker compose up --build
```

Open the app at [http://127.0.0.1:3000](http://127.0.0.1:3000). The API listens at [http://127.0.0.1:8842](http://127.0.0.1:8842); its health endpoint is [http://127.0.0.1:8842/health](http://127.0.0.1:8842/health), and the interactive API reference is [http://127.0.0.1:8842/docs](http://127.0.0.1:8842/docs).

## Run without Docker

Use Python 3.13 and Node.js 22 or newer.

```bash
cp .env.example .env
python3.13 -m venv backend/.venv
backend/.venv/bin/python -m pip install -r backend/requirements.txt
```

Start the API from the repository root:

```bash
cd backend
.venv/bin/python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8842
```

In another terminal, start the frontend:

```bash
cd frontend
npm ci
npm run dev -- --hostname 127.0.0.1
```

## Configuration

The API reads its environment from the repository root `.env` file. The frontend reads `frontend/.env.local`; begin with `frontend/.env.example`.

| Variable | Used for |
|---|---|
| `NVIDIA_API_KEY` | Live model calls from the shopping assistant |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Existing test-mode checkout integration |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google sign-in |
| `JWT_SECRET_KEY` | Signing application login tokens; set a long random value |
| `FRONTEND_URL` | The frontend origin accepted by the API for CORS and login redirects |
| `NEXT_PUBLIC_API_URL` | API origin compiled into the frontend bundle |
| `DATABASE_URL` | SQLite by default; use a managed PostgreSQL database for deployment |

Keep credentials in local environment files or the hosting provider's secret store. Do not commit `.env` or `frontend/.env.local`.

## Deploy with Vercel and Supabase

Vercel can host both the Next.js frontend and the FastAPI API as separate projects. Use Supabase for durable PostgreSQL storage. See [DEPLOYMENT.md](DEPLOYMENT.md) for project roots, environment variables, and database initialization steps.

## Current shape and limitations

- The API is a separate FastAPI service; the frontend calls it using `NEXT_PUBLIC_API_URL`.
- Local development uses SQLite. Hosted deployments need a managed PostgreSQL database such as Supabase.
- Checkout and OAuth depend on external credentials and callback/CORS settings.
- AI responses depend on the configured model provider and network access.
- Campaign conversion and revenue figures are simulated demo metrics.
