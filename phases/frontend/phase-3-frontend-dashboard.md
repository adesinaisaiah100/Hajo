# Frontend Phase 3 - Dashboard & Provider Tools

**Phase reference:** Frontend Phase 3
**Scope:** Provider and customer dashboards, analytics previews, provider tools (services, bookings management).

## Goal
Deliver the dashboard experience for providers and customers with charts, KPI tiles, and management flows.

## Deliverables
- `app/(provider)/page.tsx` — provider dashboard overview
- `app/(provider)/bookings/*` — accept/decline controls
- `app/(provider)/services/*` — add/edit service UI
- `app/(provider)/analytics/page.tsx` — earnings charts
- Shared components for charts (`EarningsChart`) and score visualization (`ScoreCircle`)

## Implementation notes
- Use `recharts` for charts and ensure data payloads are compact.
- Keep KPI tiles accessible and keyboard navigable.

## Important snippets

### Chart data fetch (useQuery)
```ts
const { data } = useQuery(['earnings', providerId], () => analyticsApi.monthlyEarnings(providerId));
```

## Verification checklist
- Provider can accept and mark bookings complete
- Analytics charts render with seeded data
- Services CRUD works and reflects in provider profile

## Risks & follow-ups
- Consider debouncing chart refreshes when filtering
- Add CSV export for analytics later if requested
