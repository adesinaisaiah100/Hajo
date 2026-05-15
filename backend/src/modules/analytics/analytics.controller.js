const asyncHandler = require('../../utils/asyncHandler');
const { getProviderAnalytics } = require('../transactions/transaction.service');

async function handleGetDashboardAnalytics(req, res) {
  const analytics = await getProviderAnalytics(req.user.id);
  res.status(200).json({ success: true, analytics });
}

module.exports = {
  getDashboardAnalytics: asyncHandler(handleGetDashboardAnalytics)
};