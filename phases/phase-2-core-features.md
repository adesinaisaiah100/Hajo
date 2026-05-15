# Phase 2 - Core Features

**Phase reference:** Phase 2
**Scope:** Booking lifecycle, Squad escrow, wallet flows, transactions, reviews, and AI matching

## Goal

Add the money movement and marketplace logic that makes the platform useful. This phase turns the authenticated user base from Phase 1 into an actual services marketplace.

## Frontend

### What gets built

- Search results page
- Provider profile page
- Booking form and booking confirmation flow
- Customer wallet page
- Provider wallet page
- Shared cards for bookings, providers, transactions, and score badges
- Loading states for AI search and wallet actions

### How it works

The frontend will consume the booking, wallet, transaction, and AI endpoints from the backend. The pages should use React Query for server state and small reusable UI components so the same patterns work across customer and provider flows.

### Why it matters

This phase is where the product becomes a marketplace instead of an account system. Users can now search, book, pay, and see money movement.

### Files added or changed

| File | Change Type | Why It Matters |
|---|---|---|
| `app/search/page.tsx` | Added | AI provider search UI |
| `app/providers/[id]/page.tsx` | Added | Public provider profile |
| `app/(customer)/bookings/page.tsx` | Added | Customer booking list |
| `app/(customer)/bookings/[id]/page.tsx` | Added | Customer booking detail |
| `app/(customer)/wallet/page.tsx` | Added | Customer wallet UI |
| `app/(provider)/bookings/page.tsx` | Added | Provider booking queue |
| `app/(provider)/wallet/page.tsx` | Added | Provider wallet UI |
| `src/components/customer/BookingForm.tsx` | Added | Booking creation form |
| `src/components/shared/BookingCard.tsx` | Added | Reusable booking display |
| `src/components/provider/ScoreCircle.tsx` | Added | Credit score visualization |
| `src/services/booking.api.js` | Added | Booking requests |
| `src/services/wallet.api.js` | Added | Wallet calls |
| `src/services/ai.api.js` | Added | Claude search calls |
| `src/hooks/useBookings.js` | Added | Booking query hooks |
| `src/hooks/useWallet.js` | Added | Wallet query hooks |

### Important code snippets

#### AI search query
File: `src/services/ai.api.js`

```js
export async function matchProviders(payload) {
  const response = await api.post("/ai/match", payload);
  return response.data.data;
}
```

This keeps search logic isolated from page components.

#### Booking payment action
File: `app/(customer)/bookings/[id]/page.tsx`

```tsx
const handlePay = async () => {
  await payBooking(bookingId);
  router.push(`/customer/bookings/${bookingId}`);
};
```

This is the primary customer payment action that follows booking creation.

## Backend

### What gets built

- Booking routes, controllers, and services
- Squad escrow charge and release integration
- Wallet balance and withdrawal endpoints
- Transaction history and summaries
- Squad webhook handler for money events
- Review creation and review listing endpoints
- AI provider matching endpoint
- AI score breakdown and insight endpoints
- Score recalculation after successful completion events

### How it works

A customer creates a booking, the provider accepts it, Squad charges the wallet into escrow, and the customer confirms completion to release funds. Every financial event is written to transactions and used for wallet history, analytics, and score updates. Claude is used to rank providers and create insight text from business activity.

### Why it matters

This phase unlocks the real product value: trust, payment, and measurable reputation.

### Files added or changed

| File | Change Type | Why It Matters |
|---|---|---|
| `backend/src/modules/bookings/booking.routes.js` | Added | Booking endpoints |
| `backend/src/modules/bookings/booking.controller.js` | Added | Booking request handling |
| `backend/src/modules/bookings/booking.service.js` | Added | Booking logic and escrow flow |
| `backend/src/modules/wallet/wallet.routes.js` | Added | Wallet endpoints |
| `backend/src/modules/wallet/wallet.service.js` | Added | Balance and withdrawal logic |
| `backend/src/modules/transactions/transaction.routes.js` | Added | Transaction history endpoints |
| `backend/src/modules/transactions/webhook.handler.js` | Added | Squad webhook processing |
| `backend/src/modules/reviews/review.routes.js` | Added | Review endpoints |
| `backend/src/modules/ai/ai.routes.js` | Added | AI endpoints |
| `backend/src/modules/ai/matching.service.js` | Added | Claude search ranking |
| `backend/src/modules/ai/scoring.service.js` | Added | Score calculation |
| `backend/src/modules/ai/insights.service.js` | Added | Claude insights generation |
| `backend/src/integrations/squad/squad.payment.js` | Added | Escrow charge integration |
| `backend/src/integrations/squad/squad.transfer.js` | Added | Escrow release and withdrawal |
| `backend/src/middleware/webhookSignature.middleware.js` | Added | Webhook security |

### Important code snippets

#### Booking escrow charge
File: `backend/src/modules/bookings/booking.service.js`

```js
const payment = await chargeWallet({
  amount: booking.totalCharged,
  customerAccountRef: customer.squadAccountRef,
  bookingId: booking.id,
});
```

This is the point where the booking moves from request to financial escrow.

#### Score recomputation after payout
File: `backend/src/modules/ai/scoring.service.js`

```js
const totalScore = (jobsScore * 0.4) + (earningsScore * 0.3) + (ratingScore * 0.2) + (tenureScore * 0.1);
```

This is the formula that turns behavior into a score tier.

## Verification checklist

- Booking request creation works
- Provider accept/decline works
- Escrow charge and release work
- Transactions are written on webhook success
- Reviews can only be created after completion
- AI search returns ranked providers
- Score updates after completed bookings

## Risks and follow-up notes

- Webhook replay protection should be reviewed carefully
- Score calculations must stay deterministic
- Search results should remain fast even when Claude is slow

## Implementation update

### Frontend progress completed

- Added the Phase 2 marketplace routes in `frontend/app` for search, provider profile, customer bookings, customer booking detail, customer booking creation, customer wallet, provider bookings, and provider wallet.
- Added a reusable responsive dashboard shell for `/customer/*` and `/provider/*` routes so the money and booking flows already sit in the intended application frame.
- Added shared marketplace components for providers, bookings, payment summaries, score badges, transaction lists, skeleton states, and empty states.
- Added React Query hooks and service wrappers for search, bookings, wallet state, and provider profile loading.
- Added a seeded marketplace data layer so the frontend remains interactive while the backend still lacks public provider routes and wallet-specific endpoints.
- Cleaned up the global frontend visual system to align more closely with `docs/design.md`, especially by removing unnecessary gradients from the shared foundation and keeping the UI lighter and more functional.

### Current contract note

The frontend is prepared to consume the Phase 2 backend, but it currently falls back in a few places because the active backend in this repository does not yet expose all of the routes listed in this phase document. Today:

- booking create, accept, complete, cancel actions attempt the backend endpoints first
- transaction summary is consumed for wallet history when available
- public provider profile, provider search, and booking list/detail screens use a local fallback layer until those endpoints are available
