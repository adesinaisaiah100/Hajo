# Hajo — MVP System Design & Architecture Document

**Version:** 1.0 — Hackathon MVP
**Author:** Engineering Team
**Target:** Squad Hackathon Demo · 4-Day Build
**Scale Target:** Pilot to 10,000 users → National deployment
**Client Stack:** Next.js web app with App Router

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Problem Statement & Solution Framing](#2-problem-statement--solution-framing)
3. [Core Value Propositions](#3-core-value-propositions)
4. [System Architecture Overview](#4-system-architecture-overview)
5. [Technology Stack — Full Justification](#5-technology-stack--full-justification)
6. [Backend Architecture](#6-backend-architecture)
7. [Frontend Architecture](#7-frontend-architecture)
8. [Database Schema](#8-database-schema)
9. [API Design & Endpoints](#9-api-design--endpoints)
10. [Squad API Integration](#10-squad-api-integration)
11. [AI Layer — Claude Integration](#11-ai-layer--claude-integration)
12. [Credit Scoring System](#12-credit-scoring-system)
13. [Authentication & Security](#13-authentication--security)
14. [All Screens — Frontend Design Specification](#14-all-screens--frontend-design-specification)
15. [Full Folder & File Structure](#15-full-folder--file-structure)
16. [Dependencies — Complete List](#16-dependencies--complete-list)
17. [Infrastructure & Deployment](#17-infrastructure--deployment)
18. [Data Flow Diagrams](#18-data-flow-diagrams)
19. [Background Jobs](#19-background-jobs)
20. [Economic Viability & Business Model](#20-economic-viability--business-model)
21. [Scalability Plan](#21-scalability-plan)
22. [MVP Scope — In vs Out](#22-mvp-scope--in-vs-out)
23. [4-Day Build Plan](#23-4-day-build-plan)

---

## 1. Product Overview

**Hajo** is a responsive two-sided local services marketplace that digitally onboards informal workers — barbers, electricians, plumbers, tailors, event planners, dry cleaners, caterers, logistics providers, and more — and connects them to customers who need their services. Every user on the platform gets an embedded financial wallet powered by Squad API. Every transaction builds a verifiable economic identity, replacing the need for a bank history with behavioral data that grows over time.

The mobile app is the primary product for the hackathon because it matches how the target users actually operate: low-friction phone access, fast onboarding, location-aware discovery, and simple wallet interactions.

The platform addresses three simultaneous problems:

- Informal workers are invisible to the formal economy.
- Customers cannot discover or trust local service providers.
- Financial institutions cannot serve this population because they have no data on them.

Hajo solves all three by being the platform where informal workers work, get paid, and build a financial identity simultaneously.

---

## 2. Problem Statement & Solution Framing

### The Context

A mid-sized African nation, with Nigeria as the primary market, faces a significant economic gap: millions of skilled informal workers operate entirely outside formal systems. They earn in cash, have no transaction history, and are therefore excluded from credit, savings products, and insurance. On the other side, millions of urban residents need these services but have no trusted, searchable platform to find verified providers.

### What Hajo Does

| Hackathon Requirement | How Hajo Addresses It |
|---|---|
| Digitally onboard informal workers | Phone OTP + profile creation + Squad virtual account, all in under 5 minutes |
| AI matching by skills, location, language, context | Claude processes natural language queries and ranks nearby verified providers with reasoning |
| Connect users to financial services | Squad wallet created at signup; escrow payments; transaction history builds credit profile |
| Use alternative data instead of credit history | Credit score computed from completed bookings, total earned, average rating, account age |
| Learn and improve as more users join | More transactions create richer scoring data and better AI matching context |
| Squad API as core transactional layer | Virtual accounts, payment collection, escrow, transfers, and webhooks all via Squad |

---

## 3. Core Value Propositions

### For Service Providers

- Get discovered by customers in their city.
- Get paid safely with escrow protecting both parties.
- Build a financial identity from every completed job.
- Manage their business from a dashboard — revenue, bookings, customer analytics.
- Unlock financial products in phase 2.

### For Customers

- Find verified, rated providers near them using plain language search powered by AI.
- Book and pay safely.
- Trust the platform through behavioral history and phone verification.

### For Financial Institutions

- Access a pre-scored population of creditworthy informal workers.
- No KYC cold start; users already have economic activity history.
- API access to anonymised credit profiles for loan underwriting.

---

## 4. System Architecture Overview

```
┌───────────────────────────────────────────────────────────────┐
│                      MOBILE CLIENT LAYER                      │
│  Next.js web app — responsive, SEO-friendly, SSR ready        │
│  Auth · Customer flows · Provider flows · Wallet · Insights   │
└──────────────────────────┬────────────────────────────────────┘
                           │ HTTPS / REST JSON
┌──────────────────────────▼────────────────────────────────────┐
│                        API GATEWAY                             │
│        Node.js + Express — deployed on Render                  │
│   CORS · Helmet · Rate Limiting · JWT Auth · Zod Validation    │
└──────────────────────────┬────────────────────────────────────┘
                           │
┌──────────────────────────▼────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                        │
│              Modular Express Services                           │
│  auth · users · providers · services · bookings                │
│  wallet · transactions · reviews · ai · notifications          │
└────┬──────────────────┬──────────────────┬─────────────────────┘
     │                  │                  │
┌────▼────┐    ┌────────▼────────┐   ┌─────▼─────────┐
│ SQUAD   │    │  ANTHROPIC      │   │ TERMII /      │
│ API     │    │  CLAUDE API     │   │ SUPABASE      │
│Wallets  │    │ Matching +      │   │ STORAGE       │
│Payments │    │ Insights + Score│   │ OTP SMS       │
│Webhooks │    └─────────────────┘   └───────────────┘
└─────────┘
     │
┌────▼──────────────────────────────────────────────────────────┐
│                       DATA LAYER                              │
│        Supabase PostgreSQL + Prisma ORM                       │
│  Users · Providers · Services · Bookings · Transactions      │
│  Reviews · CreditScores · Notifications                       │
└───────────────────────────────────────────────────────────────┘
     │
┌────▼──────────────────────────────────────────────────────────┐
│                   BACKGROUND JOBS                             │
│              node-cron (inside Express server)                │
│  Nightly score refresh · Hourly escrow timeout check         │
└───────────────────────────────────────────────────────────────┘

### Architecture Principles

**Web-first for the client.** Next.js is a better fit than a mobile-only frontend for the hackathon because the user flows are short, transactional, and location-driven, while provider pages benefit from SSR and SEO.

**Modular monolith for MVP.** The backend stays a monolith with clear module boundaries. This is faster to build in 4 days and easy to split later.

**Supabase as infrastructure, Prisma as interface.** Supabase hosts Postgres and storage; Prisma provides type-safe access and migrations.

**Squad as the financial backbone.** Every money movement routes through Squad API.

**AI as a feature, not infrastructure.** Claude is called at specific touchpoints only.

---

## 5. Technology Stack — Full Justification

### Backend

| Technology | Decision | Reason |
|---|---|---|
| Node.js + Express | Primary framework | Async-first, huge ecosystem, fast to build, JSON-native. |
| Supabase PostgreSQL | Primary database | Free managed Postgres, instant setup, no DevOps needed. |
# Hajo — MVP System Design & Architecture Document

**Version:** 1.0 — Hackathon MVP
**Author:** Engineering Team
**Target:** Squad Hackathon Demo · 4-Day Build
**Scale Target:** Pilot to 10,000 users → National deployment
**Client Stack:** Next.js web app with App Router

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Problem Statement & Solution Framing](#2-problem-statement--solution-framing)
3. [Core Value Propositions](#3-core-value-propositions)
4. [System Architecture Overview](#4-system-architecture-overview)
5. [Technology Stack — Full Justification](#5-technology-stack--full-justification)
6. [Backend Architecture](#6-backend-architecture)
7. [Frontend Architecture](#7-frontend-architecture)
8. [Database Schema](#8-database-schema)
9. [API Design & Endpoints](#9-api-design--endpoints)
10. [Squad API Integration](#10-squad-api-integration)
11. [AI Layer — Claude Integration](#11-ai-layer--claude-integration)
12. [Credit Scoring System](#12-credit-scoring-system)
13. [Authentication & Security](#13-authentication--security)
14. [All Screens — Frontend Design Specification](#14-all-screens--frontend-design-specification)
15. [Full Folder & File Structure](#15-full-folder--file-structure)
16. [Dependencies — Complete List](#16-dependencies--complete-list)
17. [Infrastructure & Deployment](#17-infrastructure--deployment)
18. [Data Flow Diagrams](#18-data-flow-diagrams)
19. [Background Jobs](#19-background-jobs)
20. [Economic Viability & Business Model](#20-economic-viability--business-model)
21. [Scalability Plan](#21-scalability-plan)
22. [MVP Scope — In vs Out](#22-mvp-scope--in-vs-out)
23. [4-Day Build Plan](#23-4-day-build-plan)

---

## 1. Product Overview

**Hajo** is a responsive two-sided local services marketplace that digitally onboards informal workers — barbers, electricians, plumbers, tailors, event planners, dry cleaners, caterers, logistics providers, and more — and connects them to customers who need their services. Every user on the platform gets an embedded financial wallet powered by Squad API. Every transaction builds a verifiable economic identity, replacing the need for a bank history with behavioral data that grows over time.

The mobile app is the primary product for the hackathon because it matches how the target users actually operate: low-friction phone access, fast onboarding, location-aware discovery, and simple wallet interactions.

The platform addresses three simultaneous problems:

- Informal workers are invisible to the formal economy.
- Customers cannot discover or trust local service providers.
- Financial institutions cannot serve this population because they have no data on them.

Hajo solves all three by being the platform where informal workers work, get paid, and build a financial identity simultaneously.

---

## 2. Problem Statement & Solution Framing

### The Context

A mid-sized African nation, with Nigeria as the primary market, faces a significant economic gap: millions of skilled informal workers operate entirely outside formal systems. They earn in cash, have no transaction history, and are therefore excluded from credit, savings products, and insurance. On the other side, millions of urban residents need these services but have no trusted, searchable platform to find verified providers.

### What Hajo Does

| Hackathon Requirement | How Hajo Addresses It |
|---|---|
| Digitally onboard informal workers | Phone OTP + profile creation + Squad virtual account, all in under 5 minutes |
| AI matching by skills, location, language, context | Claude processes natural language queries and ranks nearby verified providers with reasoning |
| Connect users to financial services | Squad wallet created at signup; escrow payments; transaction history builds credit profile |
| Use alternative data instead of credit history | Credit score computed from completed bookings, total earned, average rating, account age |
| Learn and improve as more users join | More transactions create richer scoring data and better AI matching context |
| Squad API as core transactional layer | Virtual accounts, payment collection, escrow, transfers, and webhooks all via Squad |

---

## 3. Core Value Propositions

### For Service Providers

- Get discovered by customers in their city.
- Get paid safely with escrow protecting both parties.
- Build a financial identity from every completed job.
- Manage their business from a dashboard — revenue, bookings, customer analytics.
- Unlock financial products in phase 2.

### For Customers

- Find verified, rated providers near them using plain language search powered by AI.
- Book and pay safely.
- Trust the platform through behavioral history and phone verification.

### For Financial Institutions

- Access a pre-scored population of creditworthy informal workers.
- No KYC cold start; users already have economic activity history.
- API access to anonymised credit profiles for loan underwriting.

---

## 4. System Architecture Overview

```
┌───────────────────────────────────────────────────────────────┐
│                      MOBILE CLIENT LAYER                      │
│  Next.js web app — responsive, SEO-friendly, SSR ready        │
│  Auth · Customer flows · Provider flows · Wallet · Insights   │
└──────────────────────────┬────────────────────────────────────┘
                           │ HTTPS / REST JSON
┌──────────────────────────▼────────────────────────────────────┐
│                        API GATEWAY                             │
│        Node.js + Express — deployed on Render                  │
│   CORS · Helmet · Rate Limiting · JWT Auth · Zod Validation    │
└──────────────────────────┬────────────────────────────────────┘
                           │
┌──────────────────────────▼────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                        │
│              Modular Express Services                           │
│  auth · users · providers · services · bookings                │
│  wallet · transactions · reviews · ai · notifications          │
└────┬──────────────────┬──────────────────┬─────────────────────┘
     │                  │                  │
┌────▼────┐    ┌────────▼────────┐   ┌─────▼─────────┐
│ SQUAD   │    │  ANTHROPIC      │   │ TERMII /      │
│ API     │    │  CLAUDE API     │   │ SUPABASE      │
│Wallets  │    │ Matching +      │   │ STORAGE       │
│Payments │    │ Insights + Score│   │ OTP SMS       │
│Webhooks │    └─────────────────┘   └───────────────┘
└─────────┘
     │
┌────▼──────────────────────────────────────────────────────────┐
│                       DATA LAYER                              │
│        Supabase PostgreSQL + Prisma ORM                       │
│  Users · Providers · Services · Bookings · Transactions      │
│  Reviews · CreditScores · Notifications                       │
└───────────────────────────────────────────────────────────────┘
     │
┌────▼──────────────────────────────────────────────────────────┐
│                   BACKGROUND JOBS                             │
│              node-cron (inside Express server)                │
│  Nightly score refresh · Hourly escrow timeout check         │
└───────────────────────────────────────────────────────────────┘
```

### Architecture Principles

**Web-first for the client.** Next.js is a better fit than a mobile-only frontend for the hackathon because the user flows are short, transactional, and location-driven, while provider pages benefit from SSR and SEO.

**Modular monolith for MVP.** The backend stays a monolith with clear module boundaries. This is faster to build in 4 days and easy to split later.

**Supabase as infrastructure, Prisma as interface.** Supabase hosts Postgres and storage; Prisma provides type-safe access and migrations.

**Squad as the financial backbone.** Every money movement routes through Squad API.

**AI as a feature, not infrastructure.** Claude is called at specific touchpoints only.

---

## 5. Technology Stack — Full Justification

### Backend

| Technology | Decision | Reason |
|---|---|---|
| Node.js + Express | Primary framework | Async-first, huge ecosystem, fast to build, JSON-native. |
| Supabase PostgreSQL | Primary database | Free managed Postgres, instant setup, no DevOps needed. |
| Prisma ORM | Database interface | Type-safe queries, migrations, clean schema definition. |
| Supabase Storage | File storage | CDN-backed storage for profile photos and documents. |
| Squad API | Financial layer | Virtual accounts, collections, transfers, webhooks. |
| Anthropic Claude | AI layer | Provider matching, scoring narratives, business insights. |
| Termii | SMS / OTP | Nigeria-friendly delivery and pricing. |
| node-cron | Background jobs | Lightweight scheduler for score refresh and escrow timeout. |
| Winston | Logging | Structured logs for debugging and webhook tracing. |

### Frontend

| Technology | Decision | Reason |
|---|---|---|
| Next.js | App runtime and tooling | Server rendering, route groups, and fast web delivery. |
| React | UI framework | Component model for the web frontend. |
| App Router | Navigation and routing | File-based routing, nested layouts, clean screen structure. |
| TypeScript | Type safety | Reduces runtime bugs and keeps API contracts clear. |
| Tailwind CSS | Styling | Tailwind-style utility classes for web. Fast UI development. |
| Zustand | Global state | Auth session, wallet snapshot, role, UI state. |
| TanStack Query | Server state | Caching, background refetch, loading/error handling. |
| React Hook Form + Zod | Forms | Fast form handling with shared validation. |
| httpOnly cookies | Token storage | Safe storage for refresh tokens and sensitive session data. |
| Framer Motion | Motion | Smooth transitions, onboarding animations, and UI motion. |
| Recharts | Charts | Analytics and score visuals inside dashboard screens. |
| Web notifications | Optional push | Good future path for booking updates and payment alerts. |

### Infrastructure

| Service | Use | Why |
|---|---|---|
| Render | Backend hosting | Easy Express deployment and env management. |
| Supabase | Database + Storage | Free tier is sufficient for demo scale. |
| GitHub | Version control | Source of truth and deployment trigger. |
| Vercel | Web builds | Preview and production builds from the same codebase. |

---

## 6. Backend Architecture

### Design Pattern: Routes → Controller → Service

Every module follows the same three-layer pattern.

```
Request → Route (endpoint + middleware)
        → Controller (unpacks req, calls service, sends res)
        → Service (business logic, DB queries, external API calls)
        → Response
```

### Module Responsibilities

**auth** handles registration, OTP generation and verification, passwordless login, JWT issuance, and Squad virtual account creation.

**users** manages the base user profile, photo uploads, and location data.

**providers** manages trade category, experience, price range, availability, and aggregate stats.

**services** handles provider service listings and active/paused state.

**bookings** manages the lifecycle from pending to completed or cancelled and coordinates escrow events.

**wallet** wraps Squad API for balance, withdrawals, and account number lookup.

**transactions** stores webhook-driven financial history and summaries.

**reviews** validates completed bookings before allowing a review.

**ai** handles provider matching, credit score computation, and business insights.

**notifications** creates in-app notification records and triggers SMS for key events.

### Error Handling

A global error handler catches unhandled errors. `AppError` provides structured status codes and messages. Prisma errors are converted into human-readable messages before they reach the client.

---

## 7. Frontend Architecture

### Routing Structure (Next.js App Router)

The app uses route groups to separate layouts without changing URL semantics for deep links.

```
(marketing)   — public landing and explainer screens
(auth)        — centered auth flow screens
(customer)     — customer dashboard and booking flow
(provider)     — provider dashboard and tools
```

### Layout Model

- Public pages use a marketing shell with header and footer.
- Auth pages use a centered card shell.
- Customer and provider areas use dashboard shells with nested layouts.
- Detail pages use route segments and shared templates.

### State Management Strategy

**Server state** comes from TanStack Query. Bookings, providers, wallet balance, transactions, and analytics all use query hooks.

**Client state** comes from Zustand. The authenticated user, role, token metadata, wallet snapshot, and UI flags live there.

### Session and Token Storage

The practical MVP approach is:

- Access token stored in memory and refreshed as needed.
- Refresh token stored in an httpOnly cookie.
- Sensitive data never stored in localStorage.

### UI System

The app should use a compact design system with:

- Primary buttons, ghost buttons, destructive buttons.
- Input, select, textarea, and OTP inputs.
- Cards for providers, bookings, and wallet actions.
- Score badge component with tier-specific color.
- Modals and drawers for wallet funding and service selection.

### API Communication Layer

All API calls go through a single Axios instance in `src/services/api.ts`. That instance:

- Attaches the access token automatically.
- Handles 401 responses by attempting silent refresh.
- Falls back to the login screen if refresh fails.

Each feature exposes typed async helpers and React Query hooks.

### Component Architecture

**ui/** components are pure presentational atoms.

**shared/** components are reusable across screens and shells.

**feature components** own local logic for one feature area.

---

## 8. Database Schema

The same Prisma model set from the web design applies here. The mobile app changes the client, not the core data model.

Key rules remain the same:

- Decimal for all money fields.
- Unique review per booking.
- Raw Squad webhook payload stored in transaction metadata.
- Provider profile cascades with user deletion.

The schema can stay identical to the web version.

---

## 9. API Design & Endpoints

All endpoints are prefixed with `/api`. Protected endpoints require an `Authorization: Bearer <token>` header. Role-protected endpoints additionally require the correct role.

The same API surface from the original design is retained:

- Auth endpoints for register, verify OTP, login, refresh, logout.
- User and provider endpoints for profile management.
- Services endpoints for provider listings.
- Booking endpoints for request, accept, complete, cancel.
- Wallet and transaction endpoints for balances, withdrawals, and history.
- Review endpoints for customer feedback.
- AI endpoints for matching, score breakdown, and insights.

The mobile client consumes these endpoints directly.

---

## 10. Squad API Integration

Squad remains the mandatory financial backbone of Hajo.

### 10.0 Sandbox Environment (Hackathon)

**IMPORTANT:** This hackathon uses **Squad sandbox environment exclusively.**

- **Sandbox Base URL:** `https://sandbox-api-d.squadco.com`
- **Dashboard:** `https://sandbox.squadco.com`
- **Credentials:** Obtain sandbox API keys from the Squad sandbox dashboard
- **Status:** All features (virtual accounts, OTP, payment collection, webhooks) are fully functional in sandbox
- **No Production Keys:** Do not use production credentials during the hackathon

**Backend & Frontend `.env` configuration:**
```env
SQUAD_SECRET_KEY=your_sandbox_secret_key
SQUAD_PUBLIC_KEY=your_sandbox_public_key
SQUAD_API_BASE=https://sandbox-api-d.squadco.com
SQUAD_ENVIRONMENT=sandbox
```

When sandbox credentials are provided, the backend automatically switches from mock integrations to real API calls. No code changes needed.

For detailed sandbox setup, test credentials, and webhooks configuration, see [docs/squad-sandbox-research.md](../../docs/squad-sandbox-research.md).

**Production Migration:** After the hackathon, migrating to production requires only updating the API keys and base URL; all code remains the same.

### 10.1 Virtual Account Creation

After OTP verification, the auth service calls Squad to create a virtual account. The app shows the account number in the wallet and onboarding success screens.

### 10.2 Payment Collection

When a provider accepts a booking, the booking service charges the customer’s Squad wallet.

### 10.3 Fund Transfer

When the customer confirms completion, funds move to the provider wallet. Withdrawals are also routed through Squad.

### 10.4 Webhook Processing

Squad sends webhook events to `/api/webhooks/squad`. The backend verifies the HMAC signature and processes events like charge success, transfer success, and wallet credit.

---

## 11. AI Layer — Claude Integration

Claude is called at three touchpoints:

1. Provider matching from natural language queries.
2. Business insights from transaction history.
3. Credit score narratives from the current score breakdown.

The prompts stay server-side in `src/integrations/claude/claude.prompts.ts`.

Mobile-specific note: AI search should feel fast and conversational, so the screen should show an optimistic loading state and incremental skeleton cards while Claude ranks the results.

---

## 12. Credit Scoring System

The scoring formula stays the same:

$$
Total\ Score = (Jobs\ Score \times 0.40)
+ (Earnings\ Score \times 0.30)
+ (Rating\ Score \times 0.20)
+ (Tenure\ Score \times 0.10)
$$

The same tier thresholds apply:

- Bronze: 0–24
- Silver: 25–49
- Gold: 50–74
- Platinum: 75–100

Scores update in real time after Squad webhook confirmation and again during nightly batch refresh.

---

## 13. Authentication & Security

### Passwordless OTP Authentication

The platform uses phone number plus OTP only.

### BVN Verification

Providers (and any users who will receive payouts) must complete BVN verification before being allowed to withdraw funds or receive payouts. BVN verification occurs after OTP verification and before enabling payout features. Phase-1 includes a BVN integration adapter with a mock fallback; Phase-2 will wire the full provider onboarding flow to the BVN verification API.

Key rules:
- Do not store full BVN numbers in plaintext; store only verification status and a tokenized reference if persistence is required.
- BVN verification is a synchronous check in the happy path, but the system must tolerate async verification responses from providers.
- Treat BVN verification failures as a hard stop for payout enablement until the user corrects their details.

### JWT Strategy for Web

- Access token: short-lived, sent in API headers.
- Refresh token: stored in an httpOnly cookie.

### Request Security

- Helmet.js sets security headers.
- CORS only allows trusted mobile/web origins as needed.
- Rate limiting protects OTP and high-risk endpoints.
- Zod validates every incoming request body.
- Squad webhooks are HMAC verified.

### Role Guards

- `requireAuth` verifies JWT validity and attaches the current user.
- `requireRole('provider')` and `requireRole('customer')` protect role-specific actions.

---

## 14. All Screens — Frontend Design Specification

### Design Principles for the Designer

- Responsive web-first at desktop and mobile widths.
- High contrast and clear typography.
- Progressive disclosure on every screen.
- Sidebar navigation on desktop and stacked navigation on mobile.
- Modals and drawers for contextual actions.
- Large touch targets and thumb-friendly layouts.
- Currency formatting in ₦ with comma separators.

### Shared Screens

#### Screen 01 — Landing Page
**Route:** `/(marketing)`

The landing screen is a responsive explainer with a strong hero, trust badges, how-it-works cards, a live stats strip, and a CTA stack for provider or customer signup.

#### Screen 02 — Onboarding Success
**Route:** `/welcome`

Shows a success animation, the Squad virtual account number, a Bronze score badge, a checklist, and one CTA into the correct dashboard.

### Auth Screens

#### Screen 03 — Role Selection
**Route:** `/register`

Two stacked cards on mobile and side-by-side cards on desktop: provider and customer.

#### Screen 04 — Provider Registration
**Route:** `/register/provider`

Multi-step form with personal details, trade details, and optional identity step.

#### Screen 05 — Customer Registration
**Route:** `(auth)/register/customer`

Single-page form optimized for speed.

#### Screen 06 — OTP Verification
**Route:** `(auth)/verify-otp`

Six-digit input boxes, resend timer, and error states.

#### Screen 07 — Login
**Route:** `(auth)/login`

Phone number input and OTP send flow.

### Customer Screens

#### Screen 08 — Customer Home
**Route:** `(customer)/home`

Greeting, wallet chip, notification badge, AI search bar, category chips, nearby provider cards, and bottom navigation.

#### Screen 09 — AI Search Results
**Route:** `(customer)/search`

Search bar, filters, result cards, match reasons, and skeleton loading states.

#### Screen 10 — Provider Public Profile
**Route:** `(public)/providers/[id]`

In mobile, this should remain shareable via deep link rather than relying on SSR SEO. The profile page contains provider header, stats chips, bio, services, reviews, and a sticky CTA.

#### Screen 11 — Book a Provider
**Route:** `(customer)/providers/[id]/book`

Service picker, date and time controls, address, description, and price summary.

#### Screen 12 — Payment Confirmation
**Route:** `(customer)/bookings/new/pay`

Shows read-only booking details, wallet balance, and a pay button.

#### Screen 13 — My Bookings
**Route:** `(customer)/bookings`

Segmented tabs for pending, active, completed, and cancelled bookings.

#### Screen 14 — Booking Detail
**Route:** `(customer)/bookings/[id]`

Provider card, timeline, escrow notice, status-specific actions, and review modal.

#### Screen 15 — Customer Wallet
**Route:** `(customer)/wallet`

Balance hero, virtual account number, bottom sheet for funding, and transaction history.

### Provider Screens

#### Screen 16 — Provider Dashboard Overview
**Route:** `(provider)/home`

Greeting, score banner, KPI cards, earnings chart, recent bookings, and quick actions.

#### Screen 17 — Provider Bookings
**Route:** `(provider)/bookings`

Tabbed booking list with accept/decline and mark-complete actions.

#### Screen 18 — Booking Detail
**Route:** `(provider)/bookings/[id]`

Customer info, job details, escrow badge, timeline, and role-specific actions.

#### Screen 19 — Services Management
**Route:** `(provider)/services`

List of services with add/edit bottom sheets.

#### Screen 20 — Provider Wallet
**Route:** `(provider)/wallet`

Available and pending balances, withdraw modal, and transaction history.

#### Screen 21 — Analytics Dashboard
**Route:** `(provider)/analytics`

Revenue, jobs, top services, geography, and KPI tiles.

#### Screen 22 — Credit Score Detail
**Route:** `(provider)/score`

Animated score circle, tier progress, factor breakdown, score history, and Claude narrative.

#### Screen 23 — AI Business Insights
**Route:** `(provider)/insights`

Insight cards, refresh state, and timestamp.

#### Screen 24 — Edit Profile
**Route:** `(provider)/profile`

Profile photo, trade details, pricing, availability, and save button.

#### Screen 25 — Settings
**Route:** `(provider)/settings`

Notification toggles, account info, legal links, support, and logout.

---

## 15. Full Folder & File Structure

### Backend

```
backend/
├── src/
│   ├── config/
│   ├── middleware/
│   ├── modules/
│   ├── integrations/
│   ├── db/
│   ├── utils/
│   ├── jobs/
│   ├── app.js
│   └── server.js
├── prisma/
├── .env
├── .env.example
└── package.json
```

### Frontend

```
mobile/
├── app/
│   ├── (marketing)/
│   ├── (auth)/
│   ├── (onboarding)/
│   ├── (customer)/
│   ├── (provider)/
│   └── _layout.tsx
├── src/
│   ├── components/
│   ├── hooks/
│   ├── store/
│   ├── services/
│   ├── lib/
│   └── styles/
├── assets/
├── app.config.ts
├── eas.json
└── package.json
```

---

## 16. Dependencies — Complete List

### Backend

The backend dependency set stays the same as the original design.

### Mobile

**Production dependencies:**

```json
{
     "next": "^16.2.6",
     "react": "19.2.4",
     "react-dom": "19.2.4",
     "tailwindcss": "^4.0.0",
     "@tailwindcss/forms": "^0.5.0",
  "zustand": "^4.5.0",
  "@tanstack/react-query": "^5.17.0",
  "axios": "^1.6.0",
  "react-hook-form": "^7.49.0",
  "zod": "^3.22.0",
  "@hookform/resolvers": "^3.3.0",
     "recharts": "^2.12.0",
     "framer-motion": "^11.0.0",
     "lucide-react": "^0.450.0",
  "date-fns": "^3.3.0"
}
```

**Dev dependencies:**

```json
{
  "typescript": "^5",
  "eslint": "^9",
  "prettier": "^3.2.0",
  "babel-plugin-module-resolver": "^5.0.2"
}
```

---

## 17. Infrastructure & Deployment

### Services

| Service | Purpose | Cost |
|---|---|---|
| Supabase | PostgreSQL DB + File Storage | Free tier for demo scale |
| Render | Backend hosting | Free tier for Express server |
| GitHub | Version control + CI trigger | Free |
| Vercel | Web build pipeline | Free enough for hackathon use |

### Environment Variables

**Backend `.env`:** same as original design.

**Frontend `.env.local`:**

```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
NEXT_PUBLIC_APP_NAME=Hajo
```

### Deployment Flow

1. Push backend changes to GitHub.
2. Render auto-deploys the API.
3. Push frontend changes to GitHub.
4. Vercel produces preview builds.
5. Squad webhook URL points to the Render backend.

### Frontend Release Note

For demo day, Vercel preview deployments are the fastest path because they provide an immediate browser-based demo. Responsive validation can be done in Chrome device emulation.

---

## 18. Data Flow Diagrams

The registration, booking, payment, and AI matching flows remain the same as the web design.

The only mobile-specific difference is that token handling uses device secure storage rather than browser cookies.

---

## 19. Background Jobs

### Score Refresh Job

Runs nightly and recalculates provider scores.

### Escrow Timeout Job

Runs hourly and auto-releases bookings older than 48 hours.

---

## 20. Economic Viability & Business Model

The revenue model stays the same: 5% platform fee on completed bookings.

The web-first angle improves conversion because the target users can act from any browser immediately, while provider pages remain indexable and shareable.

---

## 21. Scalability Plan

The scalability plan remains the same:

- Supabase for early-stage Postgres.
- PostGIS later for better geospatial filtering.
- Redis later for caching.
- Dedicated worker later for background jobs.
- Module extraction later if the monolith is split.

---

## 22. MVP Scope — In vs Out

### In Scope

- Phone OTP onboarding via Termii.
- Provider and customer profile creation.
- Squad virtual account auto-created on registration.
- AI natural language search via Claude.
- Service listing management.
- Booking lifecycle.
- Squad escrow and webhook processing.
- Transaction history.
- Credit score badge computed from behavioral data.
- Provider analytics dashboard.
- AI business insights.
- Post-job customer reviews.
- Web app built with Next.js and React.
- In-app notifications.

### Out of Scope

- Live biometric verification.
- Savings and ROSCA groups.
- Micro-insurance layer.
- Micro-loans.
- Admin dashboard.
- Dispute resolution beyond a flag.
- Multi-language support.

---

## 23. 4-Day Build Plan

### Day 1 — Backend Foundation

- Init Node.js + Express project.
- Set up Supabase and Prisma.
- Write schema and migrate.
- Build auth, users, and providers.
- Wire Squad virtual account creation.

### Day 2 — Core Features: Money + AI

- Build services and bookings.
- Wire escrow charge and release.
- Build transactions, wallet, reviews, and Squad webhook handling.
- Build AI matching, scoring, and insights.

### Day 3 — Frontend Build

- Init Next.js + TypeScript.
- Configure App Router, Tailwind CSS, Zustand, React Query, and httpOnly cookie auth.
- Build UI atoms and auth screens.
- Build customer home, search, provider profile, bookings, and wallet screens.

### Day 4 — Polish, Analytics & Deploy

- Build provider dashboard, analytics, score detail, insights, services, profile, and settings.
- Test full end-to-end flow on mobile.
- Deploy backend to Render.
- Generate Vercel previews and demo in browser.

---

## Document Notes

This document keeps the original MVP principles but uses a Next.js web client. The backend, Squad integration, AI layer, scoring model, and domain logic remain unchanged.

**Architecture designed by:** Engineering Team
**Last updated:** May 2026