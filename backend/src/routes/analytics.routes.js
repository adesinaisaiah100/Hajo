const express = require('express');
const router = express.Router();
const { getDashboardAnalytics } = require('../modules/analytics/analytics.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/dashboard', requireAuth, requireRole('PROVIDER'), getDashboardAnalytics);

module.exports = router;