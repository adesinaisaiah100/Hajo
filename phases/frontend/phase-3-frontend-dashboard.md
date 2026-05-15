# Phase 3 - Dashboard & Provider Tools

**Phase reference:** Frontend Phase 3
**Scope:** Provider dashboards, analytics, provider tools (services management).

## Goal summary
Deliver the dashboard experience for providers including their daily business overview, KPI tiles, earnings charts, and management tools to list new services.

## Frontend
The provider dashboard shell (`app/(dashboard)/provider/page.tsx`) now serves as the central hub for providers. It presents key metrics, an earnings chart, recent bookings, and quick actions. The analytics dashboard (`app/(dashboard)/provider/analytics/page.tsx`) offers deep dives into revenue trends, top services, customer geography, and completion rates. The services management screen (`app/(dashboard)/provider/services/page.tsx`) enables providers to view their listed services. New shared components like `EarningsChart.tsx` and `ScoreCircle.tsx` were introduced to visualize financial and performance data using Recharts and SVG graphics.

## Backend
The backend already provides the transaction summary, top services, and monthly earnings queries via the `getProviderAnalytics` API endpoint, which the frontend UI expects to consume.

## File register

| File | Change Type | Why It Matters |
|---|---|---|
| `frontend/app/(dashboard)/provider/page.tsx` | Updated | Primary dashboard overview screen for providers |
| `frontend/app/(dashboard)/provider/services/page.tsx` | Added | Services management view |
| `frontend/app/(dashboard)/provider/analytics/page.tsx` | Added | Deep dive analytics and charts |
| `frontend/app/components/provider/EarningsChart.tsx` | Added | Reusable bar chart component for displaying revenue |
| `frontend/app/components/provider/ScoreCircle.tsx` | Added | Reusable SVG component to visualize the credit score |
| `frontend/app/components/layout/DashboardShell.tsx` | Updated | Added links for new dashboard sections |

## Important code snippets

### Reusable Earnings Chart
File: `frontend/app/components/provider/EarningsChart.tsx`

```tsx
<ResponsiveContainer width="100%" height="100%">
  <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
    <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
    <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₦${v}`} />
    <Tooltip cursor={{ fill: "#f3f4f6" }} />
    <Bar dataKey="amount" fill="#14b8a6" radius={[4, 4, 0, 0]} />
  </BarChart>
</ResponsiveContainer>
```
This snippet demonstrates the clean, lightweight configuration of the Recharts library used for visualizing the provider's earnings in both the overview and analytics dashboards.

## Implementation notes
- Used `recharts` to render the `EarningsChart` because it integrates well with React and supports responsive containers natively.
- Created `ScoreCircle` as a custom SVG rather than pulling in a heavy charting library just for a progress ring.
- Local mocked data from `app/lib/mock-marketplace.ts` is temporarily used to build out the UI. It can be easily swapped for `react-query` hooks linked to backend APIs once they are connected.
- Updated `DashboardShell.tsx` to include all the missing provider routes, using appropriate `lucide-react` icons.

## Verification checklist
- [x] Provider dashboard renders KPI cards, earnings chart, and recent bookings.
- [x] Analytics dashboard renders comprehensive performance charts.
- [x] Services management screen shows the provider's active services.
- [x] Sidebar navigation correctly points to the new pages with active states.

## Risks and follow-up notes
- Recharts can sometimes cause hydration mismatches or resize observer loops. If encountered in production, charts may need to be wrapped in a dynamically imported component with `ssr: false`.
- Connect the frontend components to actual data hooks once the backend controllers are completely verified against the UI schema.
