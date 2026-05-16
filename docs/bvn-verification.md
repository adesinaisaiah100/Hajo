# BVN Verification — Research & Integration Notes

**Date:** May 13, 2026

## Purpose

This document describes the recommended BVN verification approach for the Hajo hackathon. BVN verification is required for provider onboarding and any user that will receive payouts.

## Providers & Options

- NIBSS BVN verification (direct) — usually requires access and commercial agreement
- Third-party BVN verifiers — companies that provide BVN lookup APIs
- Mock provider — deterministic mock used during local development and hackathon when production credentials are unavailable

## Privacy & Compliance

- Minimize storage of BVN values. Prefer storing only verification result, provider reference ID, timestamp, and a hashed token if you must persist an identifier.
- Enforce access controls on BVN-related endpoints. Limit audit logs and mask sensitive values in logs.

## API Adapter Pattern

Implement `backend/src/integrations/bvn/bvn.client.js` that exposes:

- `createBvnClient(env)` — returns `null` for `mock` provider or an axios instance for a real provider
- `verifyBvn({bvn, firstName, lastName, phone})` — returns `{ verified: boolean, reference, reason? }`

The service layer (`backend/src/modules/auth/auth.service.js`) should call an adapter and persist the verification status on the user profile.

## Mock Strategy (Hackathon)

- When `BVN_PROVIDER=mock`, the adapter should:
  - Return `verified: true` when `bvn` ends with an even digit
  - Return `verified: false` when `bvn` ends with an odd digit
  - Provide deterministic `reference` values for repeatability in tests

## Env Variables

- `BVN_PROVIDER` — `mock` or the provider slug
- `BVN_API_KEY` — provider secret
- `BVN_API_BASE` — provider base URL

## Minimal Endpoint

POST `/api/auth/verify-bvn`

Request:

```json
{ "userId": "uuid", "bvn": "12345678901" }
```

Success Response:

```json
{ "success": true, "verified": true, "reference": "bvn_ref_123" }
```

## Tests

- Add unit tests for the BVN adapter (mock behavior)
- Add smoke test that verifies the user `isVerified` field is set after a successful BVN check

## UX Notes

- Show clear messaging during BVN verification explaining why it's required.
- Provide fallback support (manual review) in case automated verification fails.

## Follow-ups

- During Phase-2, implement the real provider adapter and integration tests with provider sandbox (if available).
