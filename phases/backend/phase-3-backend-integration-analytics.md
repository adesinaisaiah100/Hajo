# Backend Phase 3 - Integration & Analytics

**Phase reference:** Backend Phase 3
**Scope:** Analytics endpoints, AI insight shaping, score narratives, caching and performance improvements.

## Goal
Provide stable analytics and insight endpoints powering dashboards and AI narratives; prepare data for high-read scenarios.

## Deliverables
- `backend/src/modules/transactions/transaction.service.js` — analytics summaries (by month, top services)
- `backend/src/modules/ai/insights.service.js` — Claude prompt shaping and caching
- `backend/src/modules/ai/scoring.service.js` — full score breakdown endpoint
- `backend/src/jobs/scoreRefresh.job.js` — nightly recalculation
- Caching layer (introduce Redis/TTL for expensive AI calls)

## Implementation notes
- Cache AI responses for 24h per provider; refresh on-demand with cooldown.
- Aggregate queries must be optimized with proper indexes (createdAt, providerId, status).
- Analytics endpoints return both aggregated and sampled raw rows for charts; keep payload small.

## Important snippets

### Monthly earnings summary (transaction.service.js)
```js
const rows = await prisma.$queryRaw`SELECT date_trunc('month', "createdAt") as month, sum(amount) as total FROM "Transaction" WHERE "providerId" = ${providerId} GROUP BY month ORDER BY month`;
```

### Cache AI insights
```js
const cacheKey = `insights:${providerId}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);
const insights = await claude.generate(...);
await redis.set(cacheKey, JSON.stringify(insights), 'EX', 86400);
return insights;
```

## Verification checklist
- Analytics endpoints return expected summaries on seeded data
- Score refresh job runs without errors and writes snapshots
- Cached insights return quickly on repeated calls

## Risks & follow-ups
- Monitor Redis memory usage for large cached payloads
- Consider summarizing historical data into daily rollups for scale
