const express = require('express');
const router = express.Router();
const { getInsights, getScore } = require('../modules/ai/ai.controller');
const { requireAuth, requireRole } = require('../middleware/auth');

router.get('/insights', requireAuth, requireRole('PROVIDER'), getInsights);
router.get('/score', requireAuth, requireRole('PROVIDER'), getScore);

module.exports = router;