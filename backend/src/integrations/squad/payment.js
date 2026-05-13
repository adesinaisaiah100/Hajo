const { createSquadClient } = require('./squad.client');
const { getEnv } = require('../../config/env');

async function initiateHostedPayment({ amount, currency = 'NGN', email, customer_name, transaction_ref, callback_url, metadata = {} }) {
  const env = getEnv();
  const client = createSquadClient();

  if (!client) {
    // Mock checkout for local development / sandbox absent
    return {
      checkout_url: `https://sandbox.mock/checkout/${transaction_ref}`,
      gateway_ref: `mock_${transaction_ref}`
    };
  }

  const payload = {
    email,
    amount,
    currency,
    initiate_type: 'inline',
    transaction_ref,
    customer_name,
    callback_url,
    payment_channels: ['card', 'bank', 'ussd', 'transfer'],
    metadata,
    pass_charge: false
  };

  const res = await client.post('/transaction/initiate', payload);
  return res.data;
}

module.exports = {
  initiateHostedPayment
};
