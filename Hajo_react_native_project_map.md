# Hajo Next.js MVP Project Map

This document is the implementation-oriented companion to the Next.js system design. It turns the product and architecture decisions into a detailed file tree, API inventory, frontend structure, middleware map, and library list for the MVP.

## 1. Repository Goal

The target build is a responsive Next.js App Router app backed by the same Express + Supabase + Squad + Claude backend described in the system design. The goal of this file is to make the project easy to scaffold, navigate, and split into clear ownership boundaries during the hackathon.

## 2. Top-Level Folder Tree

```text
skillbridge/
├── app/                         # current Next.js starter app in this workspace
├── backend/                     # Express API, business logic, integrations
├── frontend/                    # Next.js App Router web app
├── prisma/                      # database schema and migrations
├── public/                      # static assets shared by the current workspace
├── docs/                        # design docs, specs, API notes, planning docs
├── scripts/                     # seed, maintenance, and utility scripts
├── System_design                # original web system design
├── System_design_react_native.md
├── Hajo_react_native_project_map.md
├── README.md
├── package.json                 # current starter package, can be replaced or split later
└── tsconfig.json
```

## 3. Detailed Project Tree

### 3.1 Backend

```text
backend/
├── package.json
├── tsconfig.json
├── .env
├── .env.example
├── src/
│   ├── app.ts                   # Express app composition
│   ├── server.ts                # bootstrap, listen, cron startup
│   ├── config/
│   │   ├── index.ts             # exports combined config object
│   │   ├── env.ts               # env parsing and validation
│   │   ├── database.ts          # Prisma client singleton
│   │   ├── squad.ts             # Squad client settings and keys
│   │   ├── claude.ts            # Anthropic API settings and model name
│   │   ├── termii.ts            # Termii API settings
│   │   └── supabase.ts          # Supabase URL, keys, storage bucket names
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   ├── validate.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── webhookSignature.middleware.ts
│   │   ├── requestId.middleware.ts
│   │   └── notFound.middleware.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.validator.ts
│   │   │   ├── otp.store.ts
│   │   │   └── auth.types.ts
│   │   ├── users/
│   │   │   ├── user.routes.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.validator.ts
│   │   │   └── user.types.ts
│   │   ├── providers/
│   │   │   ├── provider.routes.ts
│   │   │   ├── provider.controller.ts
│   │   │   ├── provider.service.ts
│   │   │   ├── provider.validator.ts
│   │   │   └── provider.types.ts
│   │   ├── services/
│   │   │   ├── service.routes.ts
│   │   │   ├── service.controller.ts
│   │   │   ├── service.service.ts
│   │   │   ├── service.validator.ts
│   │   │   └── service.types.ts
│   │   ├── bookings/
│   │   │   ├── booking.routes.ts
│   │   │   ├── booking.controller.ts
│   │   │   ├── booking.service.ts
│   │   │   ├── booking.validator.ts
│   │   │   ├── booking.types.ts
│   │   │   └── booking.workflow.ts
│   │   ├── wallet/
│   │   │   ├── wallet.routes.ts
│   │   │   ├── wallet.controller.ts
│   │   │   ├── wallet.service.ts
│   │   │   ├── wallet.validator.ts
│   │   │   ├── wallet.types.ts
│   │   │   └── wallet.summary.ts
│   │   ├── transactions/
│   │   │   ├── transaction.routes.ts
│   │   │   ├── transaction.controller.ts
│   │   │   ├── transaction.service.ts
│   │   │   ├── transaction.types.ts
│   │   │   └── webhook.handler.ts
│   │   ├── reviews/
│   │   │   ├── review.routes.ts
│   │   │   ├── review.controller.ts
│   │   │   ├── review.service.ts
│   │   │   ├── review.validator.ts
│   │   │   └── review.types.ts
│   │   ├── ai/
│   │   │   ├── ai.routes.ts
│   │   │   ├── ai.controller.ts
│   │   │   ├── matching.service.ts
│   │   │   ├── scoring.service.ts
│   │   │   ├── insights.service.ts
│   │   │   ├── ai.validator.ts
│   │   │   └── ai.types.ts
│   │   └── notifications/
│   │       ├── notification.routes.ts
│   │       ├── notification.controller.ts
│   │       ├── notification.service.ts
│   │       ├── notification.types.ts
│   │       └── notification.dispatch.ts
│   ├── integrations/
│   │   ├── squad/
│   │   │   ├── squad.client.ts
│   │   │   ├── squad.virtualAccount.ts
│   │   │   ├── squad.payment.ts
│   │   │   ├── squad.transfer.ts
│   │   │   ├── squad.webhook.ts
│   │   │   └── squad.types.ts
│   │   ├── claude/
│   │   │   ├── claude.client.ts
│   │   │   ├── claude.prompts.ts
│   │   │   └── claude.types.ts
│   │   ├── termii/
│   │   │   ├── termii.client.ts
│   │   │   ├── termii.sms.ts
│   │   │   └── termii.types.ts
│   │   └── supabase/
│   │       ├── supabase.client.ts
│   │       ├── supabase.storage.ts
│   │       └── supabase.types.ts
│   ├── db/
│   │   ├── prisma.ts
│   │   ├── migrations/
│   │   └── seeds/
│   │       ├── categories.seed.ts
│   │       ├── demoProviders.seed.ts
│   │       ├── demoBookings.seed.ts
│   │       └── demoTransactions.seed.ts
│   ├── jobs/
│   │   ├── index.ts
│   │   ├── scoreRefresh.job.ts
│   │   ├── escrowTimeout.job.ts
│   │   ├── notificationDigest.job.ts
│   │   └── jobs.types.ts
│   ├── utils/
│   │   ├── AppError.ts
│   │   ├── response.ts
│   │   ├── logger.ts
│   │   ├── token.ts
│   │   ├── crypto.ts
│   │   ├── geoHelpers.ts
│   │   ├── money.ts
│   │   ├── date.ts
│   │   ├── pagination.ts
│   │   └── constants.ts
│   ├── validators/
│   │   ├── common.ts
│   │   ├── auth.ts
│   │   ├── booking.ts
│   │   ├── wallet.ts
│   │   └── profile.ts
│   ├── types/
│   │   ├── express.d.ts
│   │   ├── api.ts
│   │   └── domain.ts
│   └── tests/
│       ├── auth.test.ts
│       ├── booking.test.ts
│       ├── wallet.test.ts
│       ├── ai.test.ts
│       └── webhook.test.ts
└── prisma/
    ├── schema.prisma
    ├── migrations/
    └── seed.ts
```

### 3.2 Frontend App
frontend/
├── next.config.ts
├── middleware.ts
├── postcss.config.mjs
├── tailwind.config.ts
├── babel.config.js
├── metro.config.js
├── tsconfig.json
├── package.json
│   ├── fonts/
│   ├── +not-found.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │   ├── _layout.tsx
│   │   ├── layout.tsx
│   │   ├── register/
│   │   │   ├── page.tsx
│   │   │   ├── provider/page.tsx
│   │   │   └── customer/page.tsx
│   │   ├── login/page.tsx
│   │   └── verify-otp/page.tsx
│   ├── welcome/page.tsx
│   ├── search/page.tsx
│   ├── providers/[id]/page.tsx
│   ├── (customer)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── bookings/page.tsx
│   │   ├── bookings/[id]/page.tsx
│   │   ├── wallet/page.tsx
│   │   └── profile/page.tsx
│   ├── (provider)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── bookings/page.tsx
│   │   ├── bookings/[id]/page.tsx
│   │   ├── services/page.tsx
│   │   ├── wallet/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── score/page.tsx
│   │   ├── insights/page.tsx
│   │   ├── profile/page.tsx
│   │   └── settings/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   ├── error.tsx
│   └── not-found.tsx
├── components/
│   ├── ui/
│   ├── shared/
│   ├── auth/
│   ├── customer/
│   ├── provider/
│   └── search/
├── hooks/
├── store/
├── services/
├── lib/
├── styles/
├── public/
├── middleware.ts
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
│   └── providers/
│       └── [id].tsx
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── TextArea.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── OTPInput.tsx
│   │   │   ├── Loader.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── SectionHeader.tsx
│   │   │   └── ScoreBadge.tsx
│   │   ├── shared/
│   │   │   ├── AppShell.tsx
│   │   │   ├── TopBar.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   ├── SideSheet.tsx
│   │   │   ├── ProviderCard.tsx
│   │   │   ├── BookingCard.tsx
│   │   │   ├── TransactionRow.tsx
│   │   │   ├── StatChip.tsx
│   │   │   └── ModalSheet.tsx
│   │   ├── auth/
│   │   │   ├── RoleCard.tsx
│   │   │   ├── PhoneInput.tsx
│   │   │   ├── StateSelector.tsx
│   │   │   ├── LGASelector.tsx
│   │   │   └── StepIndicator.tsx
│   │   ├── customer/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── CategoryChip.tsx
│   │   │   ├── BookingForm.tsx
│   │   │   ├── PaymentSummary.tsx
│   │   │   └── ReviewModal.tsx
│   │   ├── provider/
│   │   │   ├── EarningsChart.tsx
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── ScoreCircle.tsx
│   │   │   ├── InsightCard.tsx
│   │   │   ├── KPIStat.tsx
│   │   │   └── BookingActionBar.tsx
│   │   └── search/
│   │       ├── FilterBar.tsx
│   │       ├── SearchResultCard.tsx
│   │       └── SearchSkeleton.tsx
│   ├── features/
│   │   ├── auth/
│   │   │   ├── hooks.ts
│   │   │   ├── forms.ts
│   │   │   └── screens.ts
│   │   ├── bookings/
│   │   ├── wallet/
│   │   ├── services/
│   │   ├── analytics/
│   │   ├── score/
│   │   └── insights/
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useWallet.ts
│   │   ├── useBookings.ts
│   │   ├── useProviders.ts
│   │   ├── useGeolocation.ts
│   │   ├── useNotifications.ts
│   │   └── useToast.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.api.ts
│   │   ├── user.api.ts
│   │   ├── provider.api.ts
│   │   ├── booking.api.ts
│   │   ├── wallet.api.ts
│   │   ├── transaction.api.ts
│   │   ├── review.api.ts
│   │   ├── ai.api.ts
│   │   └── notification.api.ts
│   ├── store/
│   │   ├── auth.store.ts
│   │   ├── wallet.store.ts
│   │   ├── ui.store.ts
│   │   └── search.store.ts
│   ├── lib/
│   │   ├── constants.ts
│   │   ├── validators.ts
│   │   ├── utils.ts
│   │   ├── format.ts
│   │   ├── theme.ts
│   │   └── env.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── theme.css
│   ├── providers/
│   │   ├── QueryProvider.tsx
│   │   ├── StoreProvider.tsx
│   │   └── ThemeProvider.tsx
│   ├── navigation/
│   │   ├── tabs.ts
│   │   ├── stacks.ts
│   │   └── routeGuards.ts
│   └── types/
│       ├── api.ts
│       ├── auth.ts
│       ├── booking.ts
│       ├── provider.ts
│       └── wallet.ts
└── docs/
    ├── design-system.md
    ├── api-contracts.md
    └── release-notes.md
```

## 4. API Inventory

### 4.1 Auth APIs

| Method | Route | Auth | Purpose | Main File(s) |
|---|---|---|---|---|
| POST | /api/auth/register | Public | Create user and send OTP | auth.routes.ts, auth.controller.ts, auth.service.ts |
| POST | /api/auth/verify-otp | Public | Verify OTP, create Squad account, issue tokens | auth.routes.ts, auth.controller.ts, auth.service.ts |
| POST | /api/auth/login | Public | Send OTP to existing user | auth.routes.ts, auth.controller.ts, auth.service.ts |
| POST | /api/auth/refresh | Public | Refresh access token | auth.routes.ts, auth.controller.ts, auth.service.ts |
| POST | /api/auth/logout | Protected | Revoke session | auth.routes.ts, auth.controller.ts, auth.service.ts |

### 4.2 User and Profile APIs

| Method | Route | Auth | Purpose | Main File(s) |
|---|---|---|---|---|
| GET | /api/users/me | Protected | Fetch authenticated user profile | user.routes.ts, user.controller.ts, user.service.ts |
| PATCH | /api/users/me | Protected | Update name, state, lga, photo, NIN | user.routes.ts, user.controller.ts, user.service.ts |
| GET | /api/providers | Public | Browse providers with filters | provider.routes.ts, provider.controller.ts, provider.service.ts |
| GET | /api/providers/:id | Public | Provider public profile | provider.routes.ts, provider.controller.ts, provider.service.ts |
| PATCH | /api/providers/me | Provider | Update trade, pricing, availability | provider.routes.ts, provider.controller.ts, provider.service.ts |

### 4.3 Services APIs

| Method | Route | Auth | Purpose | Main File(s) |
|---|---|---|---|---|
| GET | /api/services?providerId= | Public | List provider services | service.routes.ts, service.controller.ts, service.service.ts |
| POST | /api/services | Provider | Create a new service listing | service.routes.ts, service.controller.ts, service.service.ts |
| PATCH | /api/services/:id | Provider | Edit or pause a service | service.routes.ts, service.controller.ts, service.service.ts |
| DELETE | /api/services/:id | Provider | Delete a service if no active bookings exist | service.routes.ts, service.controller.ts, service.service.ts |

### 4.4 Booking APIs

| Method | Route | Auth | Purpose | Main File(s) |
|---|---|---|---|---|
| POST | /api/bookings | Customer | Create booking request | booking.routes.ts, booking.controller.ts, booking.service.ts |
| GET | /api/bookings | Protected | List bookings for current user | booking.routes.ts, booking.controller.ts, booking.service.ts |
| GET | /api/bookings/:id | Protected | Get booking detail with access checks | booking.routes.ts, booking.controller.ts, booking.service.ts |
| PATCH | /api/bookings/:id/accept | Provider | Accept booking and trigger escrow charge | booking.routes.ts, booking.controller.ts, booking.service.ts |
| PATCH | /api/bookings/:id/decline | Provider | Decline booking | booking.routes.ts, booking.controller.ts, booking.service.ts |
| PATCH | /api/bookings/:id/complete | Customer | Confirm completion and release funds | booking.routes.ts, booking.controller.ts, booking.service.ts |
| PATCH | /api/bookings/:id/cancel | Protected | Cancel booking and process refund if needed | booking.routes.ts, booking.controller.ts, booking.service.ts |

### 4.5 Wallet and Transaction APIs

| Method | Route | Auth | Purpose | Main File(s) |
|---|---|---|---|---|
| GET | /api/wallet/balance | Protected | Fetch live Squad balance and account number | wallet.routes.ts, wallet.controller.ts, wallet.service.ts |
| POST | /api/wallet/withdraw | Provider | Initiate withdrawal to bank | wallet.routes.ts, wallet.controller.ts, wallet.service.ts |
| GET | /api/transactions | Protected | Paginated transaction history | transaction.routes.ts, transaction.controller.ts, transaction.service.ts |
| GET | /api/transactions/summary | Provider | Earnings summary and chart data | transaction.routes.ts, transaction.controller.ts, transaction.service.ts |
| POST | /api/webhooks/squad | Squad | Receive Squad webhook events | webhook.handler.ts, squad.webhook.ts |

### 4.6 Review APIs

| Method | Route | Auth | Purpose | Main File(s) |
|---|---|---|---|---|
| POST | /api/reviews | Customer | Create review for completed booking | review.routes.ts, review.controller.ts, review.service.ts |
| GET | /api/reviews/provider/:id | Public | List reviews for provider profile | review.routes.ts, review.controller.ts, review.service.ts |

### 4.7 AI APIs

| Method | Route | Auth | Purpose | Main File(s) |
|---|---|---|---|---|
| POST | /api/ai/match | Customer | Natural language search to ranked providers | ai.routes.ts, ai.controller.ts, matching.service.ts |
| GET | /api/ai/score/:providerId | Protected | Score breakdown for a provider | ai.routes.ts, ai.controller.ts, scoring.service.ts |
| GET | /api/ai/insights/:providerId | Provider | Claude-generated business insights | ai.routes.ts, ai.controller.ts, insights.service.ts |

## 5. Frontend Architecture

### 5.1 Navigation Shells

| Route Group | Purpose | Notes |
|---|---|---|
| (marketing) | Public landing and explainer pages | No auth required |
| (auth) | Registration, login, OTP | Centered flow, step-based |
| (onboarding) | Welcome and setup success | Post-signup transition |
| (customer) | Customer dashboard and booking flow | Responsive dashboard shell |
| (provider) | Provider dashboard and tools | Responsive dashboard shell |

### 5.2 Screen Inventory

#### Marketing

- `app/(marketing)/page.tsx` - landing page with hero, CTA, trust stats, and role selection.
- `app/(marketing)/layout.tsx` - shared public wrapper.

#### Auth

- `app/(auth)/register/page.tsx` - role selection screen.
- `app/(auth)/register/provider/page.tsx` - provider onboarding flow.
- `app/(auth)/register/customer/page.tsx` - customer onboarding form.
- `app/(auth)/login/page.tsx` - login by OTP request.
- `app/(auth)/verify-otp/page.tsx` - six-digit OTP verification screen.
- `app/(auth)/layout.tsx` - auth shell.

#### Onboarding

- `app/welcome/page.tsx` - virtual account reveal and next-step CTA.

#### Customer

- `app/(customer)/page.tsx` - home feed, near-you providers, search entry.
- `app/search/page.tsx` - AI search results and filters.
- `app/(customer)/bookings/page.tsx` - booking tabs and lists.
- `app/(customer)/bookings/[id]/page.tsx` - booking detail view.
- `app/(customer)/wallet/page.tsx` - wallet balance and transactions.
- `app/(customer)/profile/page.tsx` - customer profile.
- `app/(customer)/layout.tsx` - customer dashboard shell.

#### Provider

- `app/(provider)/page.tsx` - provider dashboard summary.
- `app/(provider)/bookings/page.tsx` - booking queue and actions.
- `app/(provider)/bookings/[id]/page.tsx` - provider booking detail.
- `app/(provider)/services/page.tsx` - service management.
- `app/(provider)/wallet/page.tsx` - wallet and withdrawal.
- `app/(provider)/analytics/page.tsx` - charts and KPIs.
- `app/(provider)/score/page.tsx` - credit score detail.
- `app/(provider)/insights/page.tsx` - AI business insights.
- `app/(provider)/profile/page.tsx` - edit provider profile.
- `app/(provider)/settings/page.tsx` - settings and account controls.
- `app/(provider)/layout.tsx` - provider dashboard shell.

#### Public Provider Profile

- `app/providers/[id]/page.tsx` - shareable provider profile route.

### 5.3 Shared Frontend Components

| Folder | Purpose | Examples |
|---|---|---|
| src/components/ui | Presentational primitives | Button, Input, Badge, Card, OTPInput, ScoreBadge |
| src/components/shared | Cross-screen app shell and reusable pieces | AppShell, BottomNav, TopBar, ProviderCard, BookingCard |
| src/components/auth | Auth-specific building blocks | RoleCard, PhoneInput, StepIndicator |
| src/components/customer | Customer feature components | SearchBar, BookingForm, PaymentSummary |
| src/components/provider | Provider feature components | EarningsChart, ScoreCircle, InsightCard |
| src/components/search | Search UI elements | FilterBar, SearchResultCard, SearchSkeleton |

### 5.4 Frontend State and Data Flow

- `src/services/api.ts` is the only Axios client.
- `src/store/auth.store.ts` stores user, role, and session metadata.
- `src/store/wallet.store.ts` stores wallet snapshot data.
- `src/store/ui.store.ts` stores modals, sheets, and navigation UI state.
- `src/hooks/useAuth.ts` handles login, logout, refresh, and profile hydration.
- `src/hooks/useWallet.ts` handles balance and transactions.
- `src/hooks/useBookings.ts` handles booking queries and mutations.
- `src/hooks/useProviders.ts` handles browsing and provider profile data.

## 6. Middleware Map

### 6.1 Backend Middleware

| Middleware | Purpose | Used By |
|---|---|---|
| auth.middleware.ts | Read JWT and attach current user | protected routes |
| role.middleware.ts | Enforce provider/customer permissions | role-gated routes |
| rateLimit.middleware.ts | Protect login, OTP, and abuse-prone endpoints | auth and webhook endpoints |
| validate.middleware.ts | Validate request body and query with Zod | all route handlers |
| error.middleware.ts | Central error formatting | app-wide fallback |
| webhookSignature.middleware.ts | Verify Squad HMAC signature | /api/webhooks/squad |
| requestId.middleware.ts | Assign request correlation IDs for logs | app-wide |
| notFound.middleware.ts | Return standard 404 payload | fallback |

### 6.2 Mobile Middleware / App Guards

| Guard | Purpose | Location |
|---|---|---|
| routeGuards.ts | Redirect by auth state and role | middleware.ts and route-aware helpers |
| QueryProvider.tsx | Configure React Query client | src/providers/QueryProvider.tsx |
| StoreProvider.tsx | Provide persisted Zustand stores | src/providers/StoreProvider.tsx |
| ThemeProvider.tsx | App theme, color mode, and tokens | src/providers/ThemeProvider.tsx |

## 7. Core Libraries

### 7.1 Backend Libraries

| Library | Why It Exists |
|---|---|
| express | HTTP server and routing |
| cors | Client origin control |
| helmet | Security headers |
| compression | Response compression |
| express-rate-limit | Abuse protection |
| express-async-errors | Cleaner async error handling |
| zod | Request and config validation |
| prisma | Database access |
| @prisma/client | Generated Prisma client |
| axios | Squad, Termii, Claude HTTP requests |
| jsonwebtoken | JWT issue and verification |
| bcryptjs | OTP hashing or credential hashing if needed |
| node-cron | Background jobs |
| winston | Logging |
| uuid | External identifiers |
| dotenv | Environment variable loading |
| @anthropic-ai/sdk | Claude integration |
| @supabase/supabase-js | Storage and Supabase integration |
| multer | Uploads if needed |

### 7.2 Mobile Libraries

| Library | Why It Exists |
|---|---|
| next | App runtime and build system |
| react | UI runtime |
| react-dom | DOM renderer |
| tailwindcss | Styling system |
| @tailwindcss/forms | Form defaults |
| zustand | Client state management |
| @tanstack/react-query | Server state |
| axios | API client |
| react-hook-form | Forms |
| zod | Form and payload validation |
| @hookform/resolvers | RHF + Zod integration |
| recharts | Charts |
| @radix-ui/react-dialog | Accessible modals |
| @radix-ui/react-tabs | Tabs |
| @radix-ui/react-select | Select menus |
| @radix-ui/react-switch | Toggles |
| framer-motion | Motion |
| lucide-react | Icons |
| date-fns | Date formatting and math |

## 8. API Contracts and Payload Shapes

### 8.1 Standard Response Shapes

```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": {}
}
```

```json
{
  "success": false,
  "error": {
    "code": "BOOKING_NOT_FOUND",
    "message": "This booking does not exist or you do not have access to it."
  }
}
```

### 8.2 Auth Request Examples

#### Register

```json
{
  "name": "Chidi Okafor",
  "phone": "+2348012345678",
  "role": "PROVIDER",
  "state": "Lagos",
  "lga": "Ikeja"
}
```

#### Verify OTP

```json
{
  "phone": "+2348012345678",
  "otp": "123456"
}
```

### 8.3 Booking Request Example

```json
{
  "providerId": "prov_123",
  "serviceId": "svc_456",
  "scheduledAt": "2026-05-20T10:00:00.000Z",
  "jobAddress": "12 Adetokunbo Street, Ikeja",
  "description": "Need an electrical fault checked in the living room",
  "amount": 5000,
  "platformFee": 250,
  "totalCharged": 5250
}
```

### 8.4 Wallet Response Example

```json
{
  "success": true,
  "data": {
    "balance": 12400,
    "accountNumber": "0123456789",
    "bankName": "Wema Bank",
    "accountName": "Hajo Wallet"
  }
}
```

### 8.5 AI Match Response Example

```json
{
  "success": true,
  "data": [
    {
      "id": "prov_1",
      "rank": 1,
      "matchReason": "Matches your location and has strong ratings for electrical work.",
      "confidence": "high"
    }
  ]
}
```

## 9. Implementation Notes by File Group

### 9.1 Files That Should Exist Early

- `backend/src/app.ts`
- `backend/src/server.ts`
- `backend/src/config/env.ts`
- `backend/src/config/database.ts`
- `backend/src/middleware/auth.middleware.ts`
- `backend/src/modules/auth/auth.service.ts`
- `backend/src/modules/bookings/booking.service.ts`
- `backend/src/integrations/squad/squad.client.ts`
- `backend/src/integrations/claude/claude.client.ts`
- `app/layout.tsx`
- `app/(auth)/login/page.tsx`
- `app/(auth)/verify-otp/page.tsx`
- `app/(customer)/page.tsx`
- `app/(provider)/page.tsx`
- `src/services/api.ts`
- `src/store/auth.store.ts`
- `src/components/ui/Button.tsx`
- `src/components/shared/AppShell.tsx`

### 9.2 Files That Can Be Added After the Core Flow Works

- analytics chart components
- score circle and insight card components
- notification preferences screens
- search ranking refinements
- seed scripts and demo data expansion

## 10. Suggested Build Order

1. Create backend app skeleton, env validation, and Prisma client.
2. Build auth, user, provider, and wallet endpoints.
3. Wire Squad virtual account creation and webhook handling.
4. Scaffold Next.js app with routing, API client, and auth flow.
5. Build customer home, search, booking, wallet, and provider profile.
6. Add provider dashboard, bookings, wallet, analytics, score, and insights.
7. Add seed scripts, demo data, and background jobs.

## 11. Notes for Hackathon Scope

- Keep the backend modular monolith.
- Keep the frontend lightweight and Next.js-managed.
- Reuse the same domain model across customer and provider roles.
- Store secrets only in backend env and mobile secure storage.
- Prefer simple, reliable APIs over unnecessary abstraction.

## 12. File Tree Summary

If you need the shortest version of the project shape, the important pieces are:

- `backend/src/modules/*` for all domain logic.
- `backend/src/integrations/*` for Squad, Claude, Termii, and Supabase.
- `backend/src/middleware/*` for auth, validation, roles, rate limiting, and webhooks.
- `app/*` for all screens and navigation shells.
- `src/components/*` for UI and reusable widgets.
- `src/services/*` for API calls.
- `src/store/*` for session and UI state.
- `src/hooks/*` for data hooks.
- `middleware.ts` for auth-guarded routing.
- `prisma/schema.prisma` for the shared data model.
