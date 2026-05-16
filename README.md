# Hajo

Hajo is a two-sided local services marketplace for customers and informal service providers. It helps people discover trusted local artisans, book services, verify identity, create Squad-powered virtual accounts, and build a financial history from real work.

The product is split into three visible layers:

- The marketing site explains the product and routes users into sign-up.
- The customer and provider dashboards handle search, bookings, wallet views, verification, AI insights, and account management.
- The backend handles auth, OTP, bookings, Squad integration, AI services, scoring, and transactions.

## What The Demo Covers

The current codebase covers the main demo path end to end:

- Customer and provider registration with phone, first name, last name, and role.
- OTP verification and session creation.
- Trust Center / Tier 1 verification for creating a Squad virtual account.
- Customer search and provider profile browsing.
- Booking creation with escrow-oriented payment flow.
- Provider dashboard, wallet, score, and AI insight screens.
- Quotation-related routes are present for the Phase 3.5 flow.

The demo still depends on a running PostgreSQL database and valid environment variables for the external services you want to exercise.

## How Squad Fits In

Squad is the financial backbone of the product.

- Tier 1 verification creates a Squad virtual account and stores the account reference on the user record.
- Booking flows require a verified user with a virtual account before they can proceed.
- Wallet, escrow, transfer, and payment paths are designed around Squad-backed account data.
- The backend supports sandbox configuration through `SQUAD_SECRET_KEY`, `SQUAD_PUBLIC_KEY`, `SQUAD_WEBHOOK_SECRET`, and related variables.

## How AI Fits In

AI is used as a product feature, not as a replacement for the core application logic.

- Search and matching use AI-assisted ranking and provider discovery.
- Provider insights use AI-generated recommendations and copy.
- Quotation flows can use AI support for draft generation and refinement.
- The backend includes AI services under `backend/src/modules/ai` and a Gemini client under `backend/src/integrations/gemini`.
- `AI_PROVIDER` can switch between `gemini` and `mock` for local development.

## Repository Structure

```text
frontend/                  Next.js app router frontend
    app/(marketing)          Landing page and public marketing pages
    app/(auth)               Login, register, and OTP verification
    app/(dashboard)          Customer and provider dashboards
    app/components           Shared UI, forms, and dashboard components
    app/hooks                Frontend data hooks
    app/lib                  Utilities and mock data
    app/services             API clients
    app/store                Zustand auth and toast stores

backend/                   Express API server
    src/modules/auth         Register, OTP verification, Tier 1 verification
    src/modules/booking      Booking lifecycle and escrow-related logic
    src/modules/ai           Matching, scoring, and insight services
    src/integrations/gemini  Gemini client used by AI services
    src/integrations/squad   Squad API integration
    src/jobs                 Scheduled background jobs
    src/middleware           Auth, validation, and request middleware

docs/                      Design, system, and deployment documentation
phases/                    Phase-by-phase implementation notes
prisma/                    Prisma schema and database tooling
public/                    Static assets for the frontend
```

## Running The App

### Option 1: Docker Demo Stack

This is the fastest way to run the full stack locally.

```bash
cp .env.example .env
docker compose up -d
```

Then open:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`

If you want the root workspace script that starts the database plus both apps, run:

```bash
npm run demo
```

### Option 2: Manual Development

Backend:

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

### Root Workspace Scripts

From the repository root:

- `npm run dev` starts the frontend only.
- `npm run demo` starts Postgres, the backend, and the frontend together.
- `npm run build` builds the frontend.
- `npm run lint` runs the frontend linter.

## Environment Variables

Copy `.env.example` to `.env` before running the stack.

Required groups:

- Database: `DATABASE_URL`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- Auth: `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGIN`
- OTP: `TERMII_API_KEY`, `TERMII_SENDER_ID`
- AI: `AI_PROVIDER`, `GOOGLE_API_KEY`, `GEMINI_MODEL`, `GEMINI_API_BASE`
- Squad: `SQUAD_SECRET_KEY`, `SQUAD_PUBLIC_KEY`, `SQUAD_WEBHOOK_SECRET`, `SQUAD_API_BASE`, `SQUAD_ENVIRONMENT`
- Frontend: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`
- Optional integration values: `SUPABASE_URL`, `SUPABASE_KEY`, `REDIS_URL`, `REDIS_URI`

If `TERMII_API_KEY` is empty, OTPs are printed in the backend console for development.

## Verification Flow

1. Register with phone, first name, last name, and role.
2. Verify the OTP on `/verify-otp`.
3. Open the Trust Center at `/customer/verification` or `/provider/verification`.
4. Complete Tier 1 to create the Squad virtual account.
5. Book a provider. Unverified users are redirected to the Trust Center before submission.

## Useful References

- [docs/System_design_nextjs.md](docs/System_design_nextjs.md)
- [docs/design.md](docs/design.md)
- [docs/docker-deployment-guide.md](docs/docker-deployment-guide.md)
- [phases/README.md](phases/README.md)
- [AGENTS.md](AGENTS.md)

## Testing

Backend tests live in `backend/tests` and can be run with:

```bash
cd backend
npm test
```

For a quick smoke check:

```bash
cd backend
npm run test:smoke
```

## Notes

- The app uses Next.js App Router in `frontend/app`.
- The backend uses Express with Prisma and PostgreSQL.
- Demo-ready features are already wired into the codebase, but full end-to-end validation still depends on your local services and credentials being up.

