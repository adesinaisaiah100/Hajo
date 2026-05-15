const { refreshAllProviderScores } = require('../modules/ai/scoring.service');

async function runScoreRefreshJob() {
  console.log('[Jobs] Running score refresh job');
  const results = await refreshAllProviderScores();
  console.log(`[Jobs] Refreshed ${results.length} provider scores`);
  return results;
}

module.exports = {
  runScoreRefreshJob
};const { getScoreBreakdown } = require('../modules/ai/scoring.service');
const { prisma } = require('../config/database');

async function runScoreRefresh() {
  console.log('Starting nightly score refresh job');
  // Fetch providers/users to refresh — limit in dev to avoid heavy runs
  const providers = await prisma.user.findMany({ where: { role: 'provider' }, take: 200 }).catch(() => []);

  for (const p of providers) {
    try {
      const score = await getScoreBreakdown(p.id);
      // TODO: persist snapshots to a ScoreSnapshot table when available
      console.log(`Refreshed score for ${p.id}:`, score.overall);
      // Example persistence (uncomment when ScoreSnapshot model exists):
      // await prisma.scoreSnapshot.create({ data: { providerId: p.id, score: score.overall, breakdown: score.components } })
    } catch (err) {
      console.error('Error refreshing score for', p.id, err);
    }
  }

  console.log('Completed score refresh job');
}

module.exports = { runScoreRefresh };
