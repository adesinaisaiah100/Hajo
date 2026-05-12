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
