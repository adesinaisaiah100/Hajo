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
