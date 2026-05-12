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
