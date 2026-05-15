const asyncHandler = require('../../utils/asyncHandler');
const { getUserTransactionSummary, getProviderAnalytics } = require('./transaction.service');

async function handleGetTransactionSummary(req, res) {
  const userId = req.user.id;
  const summary = await getUserTransactionSummary(userId);
  res.status(200).json({ success: true, data: summary });
}

async function handleGetProviderAnalytics(req, res) {
  const userId = req.user.id;
  const analytics = await getProviderAnalytics(userId);
  res.status(200).json({ success: true, data: analytics });
}

module.exports = {
  getTransactionSummary: asyncHandler(handleGetTransactionSummary),
  getProviderAnalytics: asyncHandler(handleGetProviderAnalytics)
};
