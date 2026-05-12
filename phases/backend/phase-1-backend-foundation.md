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

## Implementation notes
- Use Routes → Controller → Service pattern everywhere.
- OTPs are short-lived (5m) and stored in an in-memory TTL store for MVP (replace with Redis before prod).
- JWT approach: short-lived access tokens, refresh tokens stored in httpOnly cookies.
- Squad virtual account creation is performed immediately after OTP verification and user isVerified flag set.

## Important snippets

### OTP send (auth.service.js)
```js
const otp = generateOTP();
await termii.sendSms(phone, `Your Hajo code is ${otp}`);
otpStore.set(phone, hash(otp), { ttl: 300 });
```

### Create virtual account (integrations/squad/squad.virtualAccount.js)
```js
const resp = await squadClient.post('/virtual-account', { customer_identifier: userId, display_name: name, mobile_num: phone });
await prisma.user.update({ where: { id: userId }, data: { squadAccountNo: resp.data.account_no } });
```

## Verification checklist
- `POST /api/auth/register` sends OTP
- `POST /api/auth/verify-otp` issues tokens and saves Squad account
- Protected route returns 401 without auth
- Prisma migrations run successfully

## Risks & follow-ups
- Replace in-memory OTP store with Redis for reliability
- Harden refresh token rotation for security
- Add rate limiting quickly for OTP endpoints
