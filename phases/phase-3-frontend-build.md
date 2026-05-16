# Phase 3 - Frontend Build

**Phase reference:** Phase 3
**Scope:** Full Next.js user experience for customer and provider flows

## Goal

Turn the API and marketplace logic into a complete browser experience. This phase builds the screens people will actually use and connects them to the backend endpoints from Phases 1 and 2.

## Frontend

### What gets built

- Landing page
- Auth flows for register, login, and OTP
- Customer dashboard
- Provider dashboard
- Search and provider profile pages
- Wallet screens
- Booking detail and payment confirmation flows
- Shared design system components
- Layouts, route groups, and navigation shells

### How it works

The frontend uses Next.js App Router route groups, shared layouts, and componentized UI. Server state is fetched with React Query, while form state and session data are handled with small focused stores.

### Why it matters

This phase transforms the platform from an API into a product. It is also where the demo value becomes visible.

### Files added or changed

| File | Change Type | Why It Matters |
|---|---|---|
| `app/(marketing)/page.tsx` | Added or updated | Public landing page |
| `app/(auth)/layout.tsx` | Added | Auth shell |
| `app/(auth)/register/page.tsx` | Added | Role selection |
| `app/(auth)/register/provider/page.tsx` | Added | Provider signup |
| `app/(auth)/register/customer/page.tsx` | Added | Customer signup |
| `app/(auth)/login/page.tsx` | Added | Login page |
| `app/(auth)/verify-otp/page.tsx` | Added | OTP page |
| `app/(customer)/page.tsx` | Added | Customer home |
| `app/(provider)/page.tsx` | Added | Provider dashboard |
| `src/components/ui/*` | Added | Reusable UI primitives |
| `src/components/shared/*` | Added | Shared dashboard pieces |
| `src/components/customer/*` | Added | Customer-specific widgets |
| `src/components/provider/*` | Added | Provider-specific widgets |
| `src/components/search/*` | Added | Search UI components |
| `src/hooks/useAuth.js` | Added | Auth session hook |
| `src/store/uiStore.js` | Added | Modal and layout state |
| `src/store/walletStore.js` | Added | Wallet snapshot state |

### Important code snippets

#### App shell layout
File: `app/layout.tsx`

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

This is the root shell the entire app renders through.

#### Provider dashboard composition
File: `app/(provider)/page.tsx`

```tsx
export default function ProviderHomePage() {
  return (
    <main>
      <ScoreBanner />
      <KpiGrid />
      <EarningsChart />
    </main>
  );
}
```

This shows how dashboard content stays composable and testable.

## Backend

### What gets built

- API contract alignment for all frontend pages
- Middleware support for protected route redirects
- Response shapes that match frontend loading and error states
- SSR-friendly provider profile endpoint support
- Cookie-based auth refresh behavior

### How it works

The frontend depends on stable backend endpoints, so this phase usually reveals contract gaps. Any missing fields or inconsistent responses should be fixed here before the final polish phase.

### Why it matters

Without this phase, the product cannot be demonstrated end to end. It is the user-facing surface of the system.

### Files added or changed

| File | Change Type | Why It Matters |
|---|---|---|
| `backend/src/modules/providers/provider.service.js` | Updated | Returns profile data for public pages |
| `backend/src/modules/transactions/transaction.service.js` | Updated | Supplies dashboard history and summaries |
| `backend/src/modules/wallet/wallet.service.js` | Updated | Supplies wallet balance data |
| `backend/src/modules/ai/insights.service.js` | Updated | Supplies provider insight cards |
| `backend/src/middleware/auth.middleware.js` | Updated | Supports frontend route protection flow |
| `backend/src/modules/users/user.service.js` | Updated | Supports profile editing screens |

### Important code snippets

#### Dashboard data fetch hook
File: `src/hooks/useBookings.js`

```js
export function useBookings(status) {
  return useQuery({
    queryKey: ["bookings", status],
    queryFn: () => bookingApi.listBookings({ status }),
  });
}
```

This keeps screen logic small and reusable.

#### Protected route display
File: `app/(customer)/page.tsx`

```tsx
if (!user) return <LoginPrompt />;
return <CustomerDashboard />;
```

This keeps the home page simple while auth state resolves.

## Verification checklist

- Landing page renders correctly
- Auth flow works end to end in the browser
- Customer dashboard loads from backend data
- Provider dashboard loads from backend data
- Search and profile pages render and fetch data
- Wallet and booking screens show proper loading and empty states

## Risks and follow-up notes

- Layout consistency across route groups should be reviewed
- Shared components should avoid duplicated business logic
- The UX should stay responsive on both desktop and mobile widths

## Customer UX Expansion (May 2026)

### Scope covered

Implemented the complete customer-facing marketplace workflow for discovery, search, bookings, wallet, profile, and notifications with mobile-first behavior and dashboard parity with provider flows.

### Frontend files updated

- `frontend/app/(dashboard)/customer/page.tsx` - redesigned home with greeting/wallet/notifications, AI search, category chips, near-you cards, and conditional recent bookings strip.
- `frontend/app/search/page.tsx` - rebuilt search results with persistent query bar, editable filters, active filter states, AI match reason bands, skeletons, and empty state.
- `frontend/app/(dashboard)/customer/bookings/page.tsx` - tabbed booking states (Active/Pending/Completed/Cancelled) with badges and per-tab empty messaging.
- `frontend/app/(dashboard)/customer/bookings/[id]/page.tsx` - richer booking detail page with artisan mini-card, escrow callout, timeline, quotation section, and status-aware actions.
- `frontend/app/(dashboard)/customer/wallet/page.tsx` - balance hero, inline fund-wallet block, escrow hold indicator, date-filtered transaction history.
- `frontend/app/(dashboard)/customer/profile/page.tsx` - customer profile editing, account funding info, verification state, sticky save control.
- `frontend/app/components/layout/DashboardShell.tsx` - customer notifications nav entry and bell routing.

### New frontend files

- `frontend/app/(dashboard)/customer/notifications/page.tsx` - notifications inbox with unread styles, mark-all-read, and deep links.
- `frontend/app/(dashboard)/customer/bookings/[id]/quotation/page.tsx` - booking-level quotation access route.
- `frontend/app/(dashboard)/customer/bookings/new/pay/page.tsx` - payment confirmation route UI for escrow-backed booking flow.

### Validation

- ESLint passed on all touched customer files after updates.
