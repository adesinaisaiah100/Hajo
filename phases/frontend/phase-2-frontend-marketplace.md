# Frontend Phase 2 - Marketplace UX

**Phase reference:** Frontend Phase 2
**Scope:** Search, provider profile, booking flow, wallet UI, shared cards and hooks.

## Goal
Turn the shell into a usable marketplace: search, provider pages, booking forms, and wallet UIs.

## Deliverables
- `app/search/page.tsx` — AI search UI
- `app/providers/[id]/page.tsx` — provider public profile (SSR)
- `app/(customer)/bookings/*` — list and detail pages
- `app/(customer)/wallet/page.tsx` & `app/(provider)/wallet/page.tsx`
- Reusable components: `ProviderCard`, `BookingCard`, `PaymentSummary`
- React Query hooks & `src/services/*` API wrappers

## Implementation notes
- Use skeleton loaders for AI and provider lists.
- Provider public page must be SSR for SEO.
- Keep booking form validation via `react-hook-form` + `zod`.

## Important snippets

### AI search call (src/services/ai.api.ts)
```ts
export const matchProviders = (payload) => api.post('/ai/match', payload).then(r => r.data.data);
```

### Booking creation with payment flow (app/(customer)/bookings/new)
```ts
await bookingApi.create(payload);
await payBooking(bookingId);
```

## Verification checklist
- Search returns results with match reasons
- Booking flow completes and redirects to booking detail
- Wallet pages show balance and transactions

## Risks & follow-ups
- Consider optimistic UI for booking creation to improve perceived latency
- Ensure SSR data shape matches frontend component expectations

## Implementation update

### Files changed

| File | Change Type | Why It Matters |
|---|---|---|
| `frontend/app/search/page.tsx` | Added | Introduces the AI search experience for provider discovery |
| `frontend/app/providers/[id]/page.tsx` | Added | Adds the public provider profile page with SSR fallback data |
| `frontend/app/(dashboard)/customer/providers/[id]/book/page.tsx` | Added | Adds the customer booking request route |
| `frontend/app/(dashboard)/customer/bookings/page.tsx` | Added | Adds the customer booking list with status filters |
| `frontend/app/(dashboard)/customer/bookings/[id]/page.tsx` | Added | Adds booking detail and completion/cancel actions |
| `frontend/app/(dashboard)/customer/wallet/page.tsx` | Added | Adds the customer wallet balance and transaction view |
| `frontend/app/(dashboard)/provider/bookings/page.tsx` | Added | Adds the provider booking queue with accept/decline actions |
| `frontend/app/(dashboard)/provider/wallet/page.tsx` | Added | Adds the provider wallet and payout activity view |
| `frontend/app/(dashboard)/customer/layout.tsx` | Added | Wraps customer routes in the dashboard shell |
| `frontend/app/(dashboard)/provider/layout.tsx` | Added | Wraps provider routes in the dashboard shell |
| `frontend/app/components/layout/DashboardShell.tsx` | Added | Provides the responsive app navigation shell for Phase 2 |
| `frontend/app/components/customer/BookingForm.tsx` | Added | Implements the booking form using `react-hook-form` and `zod` |
| `frontend/app/components/shared/ProviderCard.tsx` | Added | Reusable provider result card for search |
| `frontend/app/components/shared/BookingCard.tsx` | Added | Reusable booking summary card |
| `frontend/app/components/shared/PaymentSummary.tsx` | Added | Shared escrow/payment summary block |
| `frontend/app/components/shared/ScoreBadge.tsx` | Added | Shared score tier indicator |
| `frontend/app/components/shared/TransactionList.tsx` | Added | Shared transaction history renderer |
| `frontend/app/hooks/useMarketplaceSearch.ts` | Added | React Query hook for AI provider matching |
| `frontend/app/hooks/useBookings.ts` | Added | React Query hooks for booking list/detail/mutations |
| `frontend/app/hooks/useWallet.ts` | Added | React Query hook for wallet data |
| `frontend/app/services/ai.api.ts` | Added | Encapsulates AI search requests with fallback behavior |
| `frontend/app/services/booking.api.ts` | Added | Encapsulates booking API calls and mock-safe mutations |
| `frontend/app/services/wallet.api.ts` | Added | Encapsulates wallet and transaction summary access |
| `frontend/app/services/marketplace.api.ts` | Added | Handles provider profile/review loading with SSR-safe fallback |
| `frontend/app/lib/mock-marketplace.ts` | Added | Provides seeded marketplace data while backend routes are incomplete |
| `frontend/app/lib/utils.ts` | Added | Shared formatting and classname helpers |
| `frontend/app/providers.tsx` | Added | Adds the root React Query provider |
| `frontend/app/globals.css` | Updated | Reworked the shared visual foundation to remove unnecessary gradients and improve consistency |
| `frontend/app/layout.tsx` | Updated | Adds the React Query provider and switches to the new font foundation |
| `frontend/app/components/ui/Button.tsx` | Updated | Aligns button states with the design spec |
| `frontend/app/components/ui/Input.tsx` | Updated | Aligns input states with the design spec and supports `react-hook-form` refs |
| `frontend/app/components/shared/AuthPanel.tsx` | Updated | Cleans up existing Phase 1 auth styling to match the newer light-system direction |
| `frontend/app/(marketing)/page.tsx` | Updated | Removes gradient-heavy starter styling and keeps the landing page aligned with the simplified design system |
| `frontend/package.json` | Updated | Adds Phase 2 frontend dependencies (`@tanstack/react-query`, `react-hook-form`, `zod`, `lucide-react`) |

### What was implemented

Phase 2 now has a usable marketplace flow on the frontend: users can search for providers, open public profiles, start a booking request, review customer bookings, inspect wallet activity, and manage the provider booking queue and provider wallet. The new screens all sit inside a responsive dashboard shell for `/customer/*` and `/provider/*`, while `/search` and `/providers/[id]` remain shareable top-level routes as described in the architecture.

The implementation follows the design guidance in `docs/design.md` by keeping the UI light-first, card-based, and spacious without leaning on unnecessary gradients. Shared pieces such as provider cards, booking cards, transaction rows, payment summaries, score badges, empty states, and skeleton states were added so later phases can extend the same patterns instead of rebuilding them.

### How it works today

- Search uses a React Query hook that tries the AI endpoint first and falls back to seeded marketplace data if the backend route is not live yet.
- Provider profile pages render on the server and try to fetch profile/review data from backend routes when available, otherwise they use the same seeded provider directory.
- Booking creation uses `react-hook-form` plus `zod`, then attempts the booking API and falls back to an in-memory marketplace store so the UX remains testable during frontend work.
- Wallet pages use the existing transaction summary endpoint when available and merge that with seeded wallet metadata until dedicated wallet endpoints are implemented.
- Customer and provider booking lists currently use the seeded booking store because list/detail booking endpoints are not exposed by the backend yet.

### Why it was done this way

The backend contract for Phase 2 is only partially available in the current repo, but blocking the entire frontend until every route exists would slow the phase down and make design review harder. The mock-backed service layer keeps the screens usable right now, while still concentrating all API decisions in dedicated service files so we can swap to the final backend contract with much smaller edits later.

## Extension: Phase 3.5 - Quotation System (Frontend Slice)

**Note:** Phase 3.5 (Quotation System & Split Escrow) extends the booking flow by inserting a quotation step between booking creation and acceptance.

In Phase 2, the flow is: Create booking → Instant acceptance → Start work.

In Phase 3.5, the flow becomes: Create booking → Quotation draft (artisan reviews) → Customer responds → Upon acceptance, work starts.

New screens added in Phase 3.5:
- **Artisan quotation review:** `app/(provider)/quotations/[id]/page.tsx` — Edit AI-drafted costs and send to customer
- **Customer quotation response:** `app/(customer)/quotations/[id]/page.tsx` — Accept/reject/negotiate quotation
- **Negotiation thread:** `NegotiationThread.tsx` component embedded in quotation response page, polling every 4 seconds

Integration points:
- Provider booking queue links to quotation review page
- Customer bookings list shows quotation status badges
- BookingCard component updated to display quotation costs

Phase 3.5 frontend depends on Phase 2 frontend dashboard and Phase 3.5 backend quotation endpoints.

See `phases/backend/phase-3.5-quotation-split-escrow-plan.md` for the full plan, including frontend implementation phases H–K.
