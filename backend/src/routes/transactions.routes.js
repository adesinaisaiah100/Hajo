const express = require('express');
const router = express.Router();
const { getTransactionSummary } = require('../modules/transactions/transaction.controller');
const { requireAuth } = require('../middleware/auth');

router.get('/summary', requireAuth, getTransactionSummary);

module.exports = router;
