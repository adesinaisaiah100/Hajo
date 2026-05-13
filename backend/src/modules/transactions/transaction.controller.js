const asyncHandler = require('../../utils/asyncHandler');
const { getUserTransactionSummary } = require('./transaction.service');

async function handleGetTransactionSummary(req, res) {
  const userId = req.user.id;

  const summary = await getUserTransactionSummary(userId);

  res.status(200).json({ success: true, summary });
}

module.exports = {
  getTransactionSummary: asyncHandler(handleGetTransactionSummary)
};
