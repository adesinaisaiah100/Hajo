const asyncHandler = require('../../utils/asyncHandler');
const { handleSquadEvent, verifyWebhookSignature } = require('./squad.service');

async function webhookHandler(req, res) {
  const event = req.body;
  const signature = req.headers['x-squad-signature'];

  // Verify signature
  if (!verifyWebhookSignature(event, signature)) {
    console.warn('[Squad Webhook] Invalid signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  await handleSquadEvent(event);
  res.status(200).json({ received: true });
}

module.exports = {
  webhookHandler: asyncHandler(webhookHandler)
};
