const express = require('express');
const router = express.Router();
const { webhookHandler } = require('../modules/webhooks/squad.controller');

// Squad will POST webhook events here
router.post('/squad', webhookHandler);

module.exports = router;
