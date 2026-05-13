# Frontend Phase 1 - Shell & Auth UI

**Phase reference:** Frontend Phase 1
**Scope:** App shell, marketing layout, auth layouts/pages, API client, auth store.

## Goal
Create the Next.js App Router skeleton, layout groups, and minimal auth UI so the frontend can call backend auth APIs from day one.

## Deliverables (Frontend-only)
- `app/layout.tsx` — root layout
- `app/(marketing)/layout.tsx` & `page.tsx` — marketing shell
- `app/(auth)/layout.tsx` & `register`, `login`, `verify-otp` pages
- `src/services/api.ts` — Axios instance with `withCredentials`
- `src/store/auth.store.ts` — session store (Zustand)
- `middleware.ts` — edge middleware for route guarding
- Basic UI primitives in `src/components/ui/*`

## Implementation notes
- Use App Router route groups for layout separation.
- Keep components small and presentational; don't call APIs from them directly.
- Pages use React Query for server state once endpoints exist.

## Important snippets

### API client (src/services/api.ts)
```ts
export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL, withCredentials: true });
```

### Auth store (src/store/auth.store.ts)
```ts
export const useAuthStore = create(set => ({ user: null, setUser: (u) => set({ user: u }) }));
```

## Verification checklist
- Landing page visible
- Auth pages render and call backend auth endpoints
- Middleware blocks protected pages when not authenticated

## Risks & follow-ups
- Ensure cookie domain and CORS are configured for deployed domains
- Test SSR provider profile rendering expectations early

## Implementation update

### Files changed

- `app/layout.tsx` — updated root metadata and base body styling for the SkillBridge shell
- `app/globals.css` — replaced starter styles with the shared Phase 1 visual foundation
- `app/(marketing)/layout.tsx` — added marketing header and footer shell
- `app/(marketing)/page.tsx` — implemented the Phase 1 landing page using the product framing and value propositions
- `app/(auth)/layout.tsx` — added centered auth layout container
- `app/(auth)/register/page.tsx` — added role-selection registration entry
- `app/(auth)/login/page.tsx` — added phone-first login page
- `app/(auth)/verify-otp/page.tsx` — added OTP verification page
- `src/components/shared/AppShell.tsx` — added layout width wrapper
- `src/components/shared/AuthPanel.tsx` — added shared auth page shell
- `src/components/shared/RegisterForm.tsx` — added registration form wired to backend auth register endpoint
- `src/components/shared/LoginForm.tsx` — added login form wired to backend auth login endpoint
- `src/components/shared/VerifyOtpForm.tsx` — added OTP form wired to backend auth verify endpoint
- `src/components/ui/Button.tsx` — added reusable button primitive
- `src/components/ui/Input.tsx` — added reusable input primitive
- `src/services/api.ts` — added shared Axios client with `withCredentials`
- `src/store/auth.store.ts` — added Zustand auth session starter store
- `middleware.ts` — added protected-route redirect rules for future customer and provider areas
- `package.json` / `package-lock.json` — added frontend state and API dependencies

### What was implemented

Phase 1 now has a proper App Router structure with separate marketing and auth route groups, a responsive landing page aligned to the SkillBridge story, and starter auth forms that can call backend endpoints immediately. The auth UI is intentionally light, but the shared `api` client and `auth` store give later phases a stable base for token/session work.

### Why it was done

This locks in the navigation and route layout before marketplace and dashboard work begins. It also removes the default Next starter UI so future phases extend real product structure instead of replacing scaffolding later.
