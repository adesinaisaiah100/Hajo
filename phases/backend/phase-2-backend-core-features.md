# Backend Phase 2 - Core Features

**Phase reference:** Backend Phase 2
**Scope:** Booking lifecycle, Squad escrow, wallet, transactions, webhook processing, reviews, score computation.

## Goal
Implement money movement, bookkeeping, and the business logic that supports bookings and provider scoring.

## Deliverables
- `backend/src/modules/bookings/*` — routes, controller, service for booking lifecycle (request → accept → complete/cancel)
- `backend/src/integrations/squad/squad.payment.js` — charge/initiate escrow
- `backend/src/integrations/squad/squad.transfer.js` — release and withdrawals
- `backend/src/modules/transactions/*` — transaction persistence and summary
- `backend/src/modules/transactions/webhook.handler.js` — Squad webhook HMAC verification + event processor
- `backend/src/modules/reviews/*` — review creation and validation
- `backend/src/modules/ai/scoring.service.js` — score calculation and saving
- `backend/src/jobs/escrowTimeout.job.js` — hourly auto-release job

## Implementation notes
- On provider accept: call Squad `transaction/initiate` to charge customer wallet; store `squadEscrowRef` on booking.
- On booking complete: call Squad transfer to provider or process via held funds; webhook `transfer.success` confirms and triggers transaction record creation.
- Webhook handler must be idempotent: use `squadEvent` or `squadRef` to deduplicate.
- Score calculation deterministic formula:
  - Jobs 40%, Earnings 30%, Rating 20%, Tenure 10%.

## Important snippets

### Charge wallet (booking.service.js)
```js
const payment = await squadPayment.charge({ amount: booking.totalCharged, customerRef: customer.squadAccountRef, bookingId: booking.id });
booking.squadEscrowRef = payment.transaction_ref;
```

### Webhook idempotency
```js
const exists = await prisma.transaction.findUnique({ where: { squadRef: payload.ref } });
if (exists) return; // already processed
```

## Verification checklist
- Booking accept triggers Squad charge (simulated sandbox)
- Webhook `charge.success` writes transaction
- Escrow auto-release job processes stale accepted bookings
- Score snapshot saved after each completed booking

## Risks & follow-ups
- Ensure webhook signature verification is correct and logs raw payloads for debugging
- Introduce a retry/backoff strategy for Squad API calls
- Add reconciliation tools for transaction mismatches

## Extension: Phase 3.5 - Quotation System

**Note:** Phase 3.5 (Quotation System & Split Escrow) builds directly on top of Phase 2 bookings. When implemented, it introduces:
- A new `Quotation` model tied to each booking
- Extended `BookingStatus` enum with `QUOTE_REQUESTED`, `QUOTE_SENT`, `NEGOTIATING`, `ACCEPTED` statuses
- A `NegotiationMessage` model for customer-artisan communication
- Split escrow logic: materials released on quotation acceptance, labour held until completion
- Gemini-powered draft quotation generation

The booking lifecycle in Phase 2 becomes: `PENDING` → (Phase 3.5: quotation draft/send/accept) → `ACTIVE` → `COMPLETED`.

See `phases/backend/phase-3.5-quotation-split-escrow-plan.md` for the full quotation implementation plan.
