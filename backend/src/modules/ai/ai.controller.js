const asyncHandler = require('../../utils/asyncHandler');
const { getProviderInsights } = require('./insights.service');
const { getProviderScoreBreakdown } = require('./scoring.service');
const { matchProviders } = require('./matching.service');

async function handleGetInsights(req, res) {
  const forceRefresh = req.query.refresh === 'true';
  const insights = await getProviderInsights(req.user.id, { forceRefresh });
  res.status(200).json({ success: true, insights });
}

async function handleGetScore(req, res) {
  const score = await getProviderScoreBreakdown(req.user.id);
  res.status(200).json({ success: true, score });
}

async function handleMatchProviders(req, res) {
  const { query, city, minRating, limit } = req.body;
  const results = await matchProviders(query, { city, minRating, limit });
  res.status(200).json({ success: true, data: results });
}

module.exports = {
  getInsights: asyncHandler(handleGetInsights),
  getScore: asyncHandler(handleGetScore),
  matchProviders: asyncHandler(handleMatchProviders)
};