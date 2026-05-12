# Phase 1 - Backend Foundation

**Phase reference:** Phase 1
**Scope:** Core backend setup, auth foundation, data model, and web app shell wiring

## Goal

Build the base platform so registration, authentication, data storage, and route protection all exist before any booking or wallet features are added. This phase creates the foundations the frontend will consume later.

## Frontend

### What gets built

- Next.js application shell
- Public landing page scaffold
- Auth page skeletons for register, login, and OTP verification
- Shared app layout and route groups
- API client and auth store wiring

### How it works

The frontend is not feature-complete in this phase. It only needs enough structure to call backend auth endpoints and show a usable shell for future phases. The main focus is layout composition, navigation, and API connection.

### Why it matters

If the frontend shell is not present early, later feature screens will have to be built without a stable routing and state pattern. This phase prevents that problem by locking in the shell and client patterns first.

### Files added or changed

| File | Change Type | Why It Matters |
|---|---|---|
| `app/layout.tsx` | Added or updated | Root shell for the Next.js app |
| `app/(marketing)/page.tsx` | Added | Public landing entry point |
| `app/(auth)/register/page.tsx` | Added | Role selection entry point |
| `app/(auth)/login/page.tsx` | Added | Phone login entry point |
| `app/(auth)/verify-otp/page.tsx` | Added | OTP verification flow |
| `src/services/api.ts` | Added | Shared API client for all calls |
| `src/store/auth.store.ts` | Added | Client auth state container |
| `src/components/ui/Button.tsx` | Added | Reusable UI primitive |
| `src/components/shared/AppShell.tsx` | Added | Shared layout wrapper |
| `middleware.ts` | Added | Route protection and auth checks |

### Important code snippets

#### Route protection starter
File: `middleware.ts`

```ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get("sb_refresh_token")?.value;
  if (!token && request.nextUrl.pathname.startsWith("/provider")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}
```

This shows the basic route-guard pattern used to protect dashboard routes.

#### Shared API client
File: `src/services/api.ts`

```ts
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});
```

This keeps all frontend network calls on one configured client.

## Backend

### What gets built

- Express app skeleton
- Environment validation
- Prisma connection and schema setup
- Auth routes and controllers
- OTP generation and verification flow
- Squad virtual account creation on successful verification
- Base user and provider records
- JWT issuance and refresh flow
- Shared middleware for auth, role checks, validation, and errors

### How it works

The backend is organized as routes, controllers, and services. Auth starts with registration, stores an OTP temporarily, verifies the OTP, then creates the Squad virtual account and returns tokens. Prisma holds the data model and middleware handles request validation and protected routes.

### Why it matters

This phase creates the trust and identity layer. Without it, the product cannot onboard users, create wallets, or separate customer and provider access.

### Files added or changed

| File | Change Type | Why It Matters |
|---|---|---|
| `backend/src/app.js` | Added | Express app setup |
| `backend/src/server.js` | Added | Server start and job bootstrap |
| `backend/src/config/env.js` | Added | Env validation |
| `backend/src/config/database.js` | Added | Prisma singleton |
| `backend/src/modules/auth/auth.routes.js` | Added | Auth endpoints |
| `backend/src/modules/auth/auth.controller.js` | Added | Request handling |
| `backend/src/modules/auth/auth.service.js` | Added | OTP and token logic |
| `backend/src/modules/auth/auth.validator.js` | Added | Zod request validation |
| `backend/src/modules/users/user.routes.js` | Added | User profile endpoints |
| `backend/src/modules/providers/provider.routes.js` | Added | Provider profile endpoints |
| `backend/src/middleware/auth.middleware.js` | Added | JWT protection |
| `backend/src/middleware/role.middleware.js` | Added | Role gating |
| `backend/src/middleware/validate.middleware.js` | Added | Request validation |
| `backend/src/middleware/error.middleware.js` | Added | Error formatting |
| `backend/src/integrations/squad/squad.virtualAccount.js` | Added | Wallet creation |
| `backend/prisma/schema.prisma` | Added | Data model |

### Important code snippets

#### OTP generation and SMS dispatch
File: `backend/src/modules/auth/auth.service.js`

```js
const otp = generateOTP();
await termii.sendSms(phone, `Your Hajo code is ${otp}`);
otpStore.set(phone, otp);
```

This is the first step of passwordless onboarding.

#### Virtual account creation
File: `backend/src/integrations/squad/squad.virtualAccount.js`

```js
const account = await squadClient.post("/virtual-account", {
  customer_identifier: userId,
  display_name: name,
  mobile_num: phone,
});
```

This creates the wallet account number the frontend will display later.

## Verification checklist

- Registration sends OTP successfully
- OTP verification issues tokens
- Squad virtual account is saved to the user record
- Protected routes reject unauthenticated requests
- Prisma connects to the database without errors

## Risks and follow-up notes

- OTP storage should be temporary and time-bound
- Route guard behavior must match cookie/token strategy
- Any schema changes here must be mirrored in later phase docs

