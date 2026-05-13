# Backend Phase 1 - Foundation

**Phase reference:** Backend Phase 1
**Scope:** Express app skeleton, env validation, Prisma schema, core middleware, auth service, OTP flow, Squad virtual account creation.

## Goal
Build a robust backend foundation so the API surface, data model, and auth primitives exist before feature work begins.

## Deliverables (Backend-only)
- `backend/src/app.js` — Express app wiring, middleware mount
- `backend/src/server.js` — DB connect, jobs bootstrap
- `backend/src/config/env.js` — environment validation (Zod)
- `backend/src/config/database.js` — Prisma client singleton
- `backend/prisma/schema.prisma` — base data model (User, Provider, Service, Booking, Transaction, Review, CreditScore)
- `backend/src/middleware/*` — auth, role, validate, error handlers
- `backend/src/modules/auth/*` — routes, controller, service (OTP + tokens)
- `backend/src/integrations/squad/squad.virtualAccount.js` — vaccount creation

## File Register

| File | Change Type | Why It Matters |
|---|---|---|
| `backend/package.json` | Added | Defines the backend as its own Node package with scripts and dependencies |
| `backend/tsconfig.json` | Added | Keeps the backend Docker build and editor tooling aligned with the package layout |
| `backend/.env.example` | Added | Documents backend-only environment variables for local setup |
| `.env.example` | Added | Gives the repo a single top-level environment template for the full stack |
| `backend/prisma/schema.prisma` | Added | Establishes the initial domain models for auth, providers, bookings, transactions, reviews, and scoring |
| `backend/src/config/env.js` | Added | Validates and normalizes backend environment variables with Zod |
| `backend/src/config/database.js` | Added | Provides a Prisma client singleton and connect/disconnect helpers |
| `backend/src/middleware/error.js` | Added | Standardizes API error responses and Prisma error translation |
| `backend/src/middleware/auth.js` | Added | Verifies JWTs and enforces role-based access |
| `backend/src/middleware/validate.js` | Added | Validates request bodies, params, and queries before controller logic runs |
| `backend/src/modules/auth/auth.routes.js` | Added | Exposes register, login, OTP verification, refresh, logout, and me routes |
| `backend/src/modules/auth/auth.controller.js` | Added | Bridges HTTP requests to the auth service and manages the refresh cookie |
| `backend/src/modules/auth/auth.service.js` | Added | Implements OTP generation, token issuance, user creation, and Squad wallet setup |
| `backend/src/integrations/termii/termii.sms.js` | Added | Sends OTP SMS or falls back to a mock transport during local development |
| `backend/src/integrations/squad/squad.virtualAccount.js` | Added | Creates Squad virtual accounts or a deterministic mock account when credentials are absent |
| `backend/src/jobs/index.js` | Added | Gives `server.js` a job bootstrap hook for later cron work |
| `backend/src/app.js` | Added | Wires middleware, health check, and API routing into one Express app |
| `backend/src/server.js` | Added | Starts the API only after the database connects and jobs bootstrap |
| `backend/tests/auth.smoke.test.js` | Added | Verifies the phase-1 auth flow with a mock Prisma layer |

## Implementation notes
- Use Routes → Controller → Service pattern everywhere.
- OTPs are short-lived (5m) and stored in an in-memory TTL store for MVP (replace with Redis before prod).
- JWT approach: short-lived access tokens, refresh tokens stored in httpOnly cookies.
- Squad virtual account creation is performed immediately after OTP verification and user isVerified flag set.
- The refresh cookie name is `sb_refresh_token` so the backend matches the current frontend route-guard convention.
- A mock Termii transport and mock Squad account fallback keep the phase usable before real API keys are plugged in.

## BVN Verification (Addendum)

For provider onboarding and any KYC-required flows, the hackathon requires a BVN verification layer. Phase-1 should include research, a mockable integration, and documentation so Phase-2 can call a verified endpoint before creating live profiles.

- Purpose: verify a user's BVN matches their provided name and phone number before creating a provider profile or enabling payouts.
- Approach: implement a `BVN` integration module with a mock fallback for local development and an adapter for real providers (NIBSS or third-party BVN verification services) when credentials are available.
- Data handling: store only verification status and minimal metadata (verification reference, timestamp). Do NOT store full BVN numbers in plaintext in the primary DB—store a hashed or tokenized reference if persistence is required.
- Env vars required (see `.env.example`): `BVN_API_KEY`, `BVN_API_BASE`, `BVN_PROVIDER`.
- Tests: add smoke tests that exercise mock BVN success and failure scenarios.
- UX: providers cannot receive payouts or have their Squad virtual-account-linked payouts enabled until BVN verification status is `verified`.

### Minimal API contract

POST `/api/auth/verify-bvn`

Request:
```json
{ "userId": "uuid", "bvn": "12345678901" }
```

Response (success):
```json
{ "success": true, "verified": true, "reference": "bvn_ref_123" }
```

Failure:
```json
{ "success": false, "verified": false, "reason": "mismatch" }
```

The backend will call the BVN adapter and record the verification reference and status on the user profile.

## Important snippets

### OTP send (auth.service.js)
```js
const otp = generateOtp();
storeOtp(phone, otp, env.OTP_TTL_SECONDS * 1000);
await sendOtpMessage(phone, otp);
```

### Create virtual account (integrations/squad/squad.virtualAccount.js)
```js
const client = createSquadClient();
if (!client) return buildMockVirtualAccount(user);

const response = await client.post('/virtual-account', {
	customer_identifier: user.id,
	display_name: `${user.firstName} ${user.lastName}`.trim(),
	mobile_num: user.phone
});
```

## Verification checklist
- `POST /api/auth/register` sends OTP
- `POST /api/auth/verify-otp` issues tokens and saves Squad account
- Protected route returns 401 without auth
- Prisma migrations run successfully
- Backend smoke test passes with the mock Prisma layer
- Generated Prisma client loads cleanly in the backend package

## Squad Sandbox Environment (Hackathon)

**Important:** This hackathon uses **Squad sandbox environment exclusively**. 

- Sandbox Base URL: `https://sandbox-api-d.squadco.com`
- All API keys must be obtained from `https://sandbox.squadco.com`
- Virtual accounts, OTP, and payment processing work fully in sandbox
- No production credentials are used during the hackathon
- See [docs/squad-sandbox-research.md](../../docs/squad-sandbox-research.md) for detailed sandbox setup and testing credentials

**Backend `.env` requirements for sandbox:**
```env
SQUAD_SECRET_KEY=your_sandbox_secret_key
SQUAD_PUBLIC_KEY=your_sandbox_public_key
SQUAD_API_BASE=https://sandbox-api-d.squadco.com
SQUAD_ENVIRONMENT=sandbox
```

The backend code automatically switches from mock OTP/virtual-account to real API calls once sandbox credentials are provided. No code changes needed.

## Risks & follow-ups
- Replace in-memory OTP store with Redis for reliability
- Harden refresh token rotation for security
- Add rate limiting quickly for OTP endpoints
- Move to production credentials only after Squad approval (post-hackathon)
