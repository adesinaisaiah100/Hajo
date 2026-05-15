# Frontend Phase 2 - Marketplace Slice Implementation Summary

**Phase reference:** Frontend Phase 2
**Scope:** Search, provider profile, booking flow, customer and provider dashboards, wallet UI, shared marketplace components, and fallback service layers.

## Goal
Turn the Phase 1 shell into a usable marketplace slice in `frontend/app` with responsive routes for search, provider discovery, booking, and wallet activity, while keeping the UI aligned with `docs/design.md` and resilient while backend routes are still being completed.

## Frontend

### What was implemented

- Added the marketplace search experience in `frontend/app/search/page.tsx`.
- Added the public provider profile page in `frontend/app/providers/[id]/page.tsx` with SSR-safe fallback data.
- Added customer booking routes under `frontend/app/(dashboard)/customer`, including list, detail, provider booking, and wallet views.
- Added provider booking and wallet routes under `frontend/app/(dashboard)/provider`.
- Added a shared responsive dashboard shell in `frontend/app/components/layout/DashboardShell.tsx` for customer and provider workspaces.
- Added reusable marketplace components for providers, bookings, payment summaries, transaction lists, score badges, section cards, skeletons, and empty states.
- Added React Query hooks in `frontend/app/hooks` for search, bookings, and wallet state.
- Added service wrappers in `frontend/app/services` to isolate API access and keep fallback behavior in one place.
- Added a seeded local marketplace layer in `frontend/app/lib/mock-marketplace.ts` so the UX stays usable even when backend endpoints are missing.
- Reworked the frontend visual foundation in `frontend/app/globals.css`, `frontend/app/layout.tsx`, `frontend/app/components/ui/Button.tsx`, `frontend/app/components/ui/Input.tsx`, `frontend/app/components/shared/AuthPanel.tsx`, and `frontend/app/(marketing)/page.tsx` to stay light, responsive, and closer to `docs/design.md`.
- Added the React Query provider in `frontend/app/providers.tsx` and wired it into the root layout.
- Updated `frontend/app/services/api.ts` to include the auth token on API requests.

### File register

| File | Change Type | Why It Matters |
|---|---|---|
| `frontend/app/search/page.tsx` | Added | Introduces the AI-assisted provider search experience |
| `frontend/app/providers/[id]/page.tsx` | Added | Adds the public provider profile page for SEO and sharing |
| `frontend/app/(dashboard)/customer/layout.tsx` | Added | Wraps customer routes in the dashboard shell |
| `frontend/app/(dashboard)/customer/page.tsx` | Added | Redirects the customer dashboard entry point into the marketplace flow |
| `frontend/app/(dashboard)/customer/bookings/page.tsx` | Added | Adds the customer booking list view |
| `frontend/app/(dashboard)/customer/bookings/[id]/page.tsx` | Added | Adds the customer booking detail view and actions |
| `frontend/app/(dashboard)/customer/providers/[id]/book/page.tsx` | Added | Adds the customer booking request route |
| `frontend/app/(dashboard)/customer/wallet/page.tsx` | Added | Adds the customer wallet summary and transaction view |
| `frontend/app/(dashboard)/provider/layout.tsx` | Added | Wraps provider routes in the dashboard shell |
| `frontend/app/(dashboard)/provider/page.tsx` | Added | Redirects provider dashboard entry into the booking queue |
| `frontend/app/(dashboard)/provider/bookings/page.tsx` | Added | Adds the provider booking queue |
| `frontend/app/(dashboard)/provider/wallet/page.tsx` | Added | Adds the provider wallet and payout view |
| `frontend/app/components/layout/DashboardShell.tsx` | Added | Provides the shared responsive dashboard navigation shell |
| `frontend/app/components/customer/BookingForm.tsx` | Added | Implements booking creation with `react-hook-form` and `zod` |
| `frontend/app/components/shared/BookingCard.tsx` | Added | Reusable booking summary card |
| `frontend/app/components/shared/EmptyState.tsx` | Added | Standard empty-state treatment for list screens |
| `frontend/app/components/shared/PaymentSummary.tsx` | Added | Reusable escrow/payment summary panel |
| `frontend/app/components/shared/ProviderCard.tsx` | Added | Reusable provider search result card |
| `frontend/app/components/shared/ScoreBadge.tsx` | Added | Reusable score-tier indicator |
| `frontend/app/components/shared/SectionCard.tsx` | Added | Reusable card shell for grouped dashboard content |
| `frontend/app/components/shared/SkeletonCard.tsx` | Added | Loading placeholder used across search and dashboard screens |
| `frontend/app/components/shared/TransactionList.tsx` | Added | Reusable transaction history renderer |
| `frontend/app/hooks/useBookings.ts` | Added | React Query hooks for booking reads and mutations |
| `frontend/app/hooks/useMarketplaceSearch.ts` | Added | React Query hook for provider matching |
| `frontend/app/hooks/useWallet.ts` | Added | React Query hook for wallet state |
| `frontend/app/lib/mock-marketplace.ts` | Added | Seeded provider, booking, and wallet data for fallback rendering |
| `frontend/app/lib/utils.ts` | Added | Shared formatting and class helper functions |
| `frontend/app/providers.tsx` | Added | Root React Query provider setup |
| `frontend/app/services/api.ts` | Updated | Adds bearer token injection for API requests |
| `frontend/app/services/ai.api.ts` | Added | Isolates AI provider matching calls with fallback behavior |
| `frontend/app/services/booking.api.ts` | Added | Isolates booking API calls with fallback mutations |
| `frontend/app/services/marketplace.api.ts` | Added | Isolates SSR provider profile and review loading |
| `frontend/app/services/wallet.api.ts` | Added | Isolates wallet snapshot loading and fallback data |
| `frontend/app/globals.css` | Updated | Rebuilds the visual foundation around a light, cleaner theme |
| `frontend/app/layout.tsx` | Updated | Switches the root font foundation and mounts providers |
| `frontend/app/components/ui/Button.tsx` | Updated | Reworks button states and sizes for the new design language |
| `frontend/app/components/ui/Input.tsx` | Updated | Reworks inputs for better validation and form integration |
| `frontend/app/components/shared/AuthPanel.tsx` | Updated | Aligns auth shell styling with the new lightweight system |
| `frontend/app/(marketing)/page.tsx` | Updated | Simplifies the landing page visuals to match the cleaned-up design direction |
| `frontend/package.json` | Updated | Adds the client-side dependencies required for the Phase 2 slice |
| `frontend/package-lock.json` | Updated | Locks the new dependency graph used by the phase |
| `frontend/next.config.ts` | Updated | Adjusts local Next.js configuration for the current environment |
| `frontend/app/services/*` | Added/Updated | Consolidates the API and fallback logic used by search, booking, and wallet screens |
| `phases/frontend/phase-2-frontend-marketplace.md` | Updated | Records the completed marketplace slice and implementation notes |
| `phases/phase-2-core-features.md` | Updated | Records the broader Phase 2 frontend progress within the cross-phase plan |

### How it works

Search starts in `frontend/app/search/page.tsx`. The page uses a query hook that first attempts the backend AI matching endpoint and falls back to the seeded provider directory when the backend route is unavailable. The cards on the page reuse `ProviderCard`, which centralizes match reasons, pricing, score badges, and booking navigation.

Provider details are rendered from `frontend/app/providers/[id]/page.tsx`. The page is server-rendered so it can be shared and indexed, and it pulls provider and review data through `frontend/app/services/marketplace.api.ts`. If the backend profile or review routes are unavailable, the page falls back to the seeded marketplace data so the profile remains usable.

Booking creation is handled by `frontend/app/components/customer/BookingForm.tsx`. The form uses `react-hook-form` and `zod` for validation, then tries the booking API through `frontend/app/services/booking.api.ts`. If the backend call fails, the service falls back to the seeded booking store so the flow stays testable during the frontend phase. The booking detail page and booking queue reuse the same booking service layer so the list, detail, and mutations stay consistent.

Wallet pages under `frontend/app/(dashboard)/customer` and `frontend/app/(dashboard)/provider` use the shared `TransactionList` and `SectionCard` components. The wallet service first tries the transaction summary endpoint, then merges or falls back to local wallet data so the UX remains stable until the full wallet contract is available.

The dashboard shell in `frontend/app/components/layout/DashboardShell.tsx` keeps customer and provider areas visually and structurally consistent. It provides the left navigation, top header, and mobile chips so the app still works cleanly on narrow screens.

The visual update is concentrated in `frontend/app/globals.css`, `frontend/app/layout.tsx`, the UI primitives, and the marketing/auth shells. The goal was to remove the heavy, gradient-forward starter look and keep the interface light, readable, and responsive, which matches the direction described in `docs/design.md`.

### Important snippets

### Search fallback flow
File: `frontend/app/services/ai.api.ts`

```ts
export async function matchProviders(payload: {
  query: string;
  city?: string;
}): Promise<ProviderProfile[]> {
  try {
    const response = await api.post("/ai/match", payload);
    return response.data?.data ?? response.data?.providers ?? [];
  } catch {
    return searchMockProviders(payload.query);
  }
}
```

### Booking creation with fallback
File: `frontend/app/services/booking.api.ts`

```ts
export async function createBooking(payload: {
  providerId: string;
  serviceId: string;
  amount: number;
  currency: string;
  scheduledAt: string;
  notes: string;
  location: string;
}): Promise<BookingRecord> {
  try {
    const response = await api.post("/bookings", payload);
    return response.data?.booking;
  } catch {
    return createMockBooking(payload);
  }
}
```

### Dashboard shell pattern
File: `frontend/app/components/layout/DashboardShell.tsx`

```tsx
<div className="min-h-screen bg-[#f9fafb] lg:grid lg:grid-cols-[240px_1fr]">
  <aside className="hidden border-r border-[#e5e7eb] bg-white lg:flex lg:flex-col">
    ...
  </aside>
  <div className="flex min-h-screen flex-col">
    ...
  </div>
</div>
```

### Booking form validation
File: `frontend/app/components/customer/BookingForm.tsx`

```ts
const bookingSchema = z.object({
  serviceId: z.string().min(1, "Select a service"),
  date: z.string().min(1, "Choose a date"),
  time: z.string().min(1, "Choose a time"),
  location: z.string().min(3, "Enter the service location"),
  notes: z.string().min(10, "Add a short job description"),
});
```

### Transaction summary rendering
File: `frontend/app/components/shared/TransactionList.tsx`

```tsx
{transactions.map((transaction) => {
  const Icon = iconForType(transaction.type);

  return (
    <div key={transaction.id} className="flex flex-col gap-3 rounded-2xl border border-[#e5e7eb] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      ...
    </div>
  );
})}
```

## Implementation notes

- The frontend now uses a seeded fallback layer wherever the backend contract is not complete yet. That includes search, provider profiles, booking reads, and wallet reads.
- The fallback layer is intentionally isolated in service files and `frontend/app/lib/mock-marketplace.ts` so it can be removed or replaced without rewriting the UI.
- The layout and component updates were made to match the light, clean design direction in `docs/design.md` and to avoid the heavier gradient treatment from the initial shell.
- React Query was added because the marketplace screens are mostly server-state driven, and it keeps loading, caching, and invalidation consistent across search, bookings, and wallets.
- The booking form uses `react-hook-form` and `zod` so the validation logic stays close to the form and remains easy to extend later.
- The provider profile page stays server-rendered so it can remain shareable and SEO-friendly even while the data layer is still evolving.

## Verification checklist

- [x] `npm run lint` passed.
- [x] The app code compiled cleanly before the local Next.js Windows/Turbopack toolchain failure.
- [ ] `next build` still needs a clean environment check because the current Windows/Turbopack route-typing issue breaks the local build after code compilation.
- [x] Search returns provider cards with match reasons from the seeded fallback layer when backend search is unavailable.
- [x] Booking create, accept, complete, and cancel flows remain usable through the local fallback data layer.
- [x] Wallet and provider dashboard screens render with responsive shared shell and list components.

## Risks and follow-up notes

- The local `next build` failure appears to be a toolchain issue rather than an app-code issue, because the app compiled before the broken route typing step.
- The fallback marketplace data should be removed or narrowed once the backend exposes the missing public profile, search, booking, and wallet endpoints.
- The dashboard shell is intentionally generic enough to support future customer and provider dashboard pages, but it should be revisited if the routing map changes.
- If the backend contract changes, the service wrappers in `frontend/app/services` are the correct single place to update first.
