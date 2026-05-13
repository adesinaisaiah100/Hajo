const { createSquadClient } = require('./squad.client');

// Release escrow funds to provider wallet
async function transferRelease({ amount, currency = 'NGN', transfer_ref, provider_account, bookingId, metadata = {} }) {
  const client = createSquadClient();

  if (!client) {
    // Mock transfer (sandbox absent)
    return {
      status: 'success',
      transfer_ref,
      gateway_ref: `mock_transfer_${transfer_ref}`,
      amount
    };
  }

  const payload = {
    amount,
    currency,
    transfer_ref,
    narration: `Booking ${bookingId} payout`,
    destination: {
      type: 'bank_account',
      account_number: provider_account
    },
    metadata: { ...metadata, bookingId, type: 'escrow_release' }
  };

  const res = await client.post('/transfer', payload);
  return res.data;
}

// Process withdrawal from provider wallet
async function processWithdrawal({ amount, currency = 'NGN', transfer_ref, provider_account, userId, metadata = {} }) {
  const client = createSquadClient();

  if (!client) {
    // Mock withdrawal (sandbox absent)
    return {
      status: 'success',
      transfer_ref,
      gateway_ref: `mock_withdrawal_${transfer_ref}`,
      amount
    };
  }

  const payload = {
    amount,
    currency,
    transfer_ref,
    narration: `Withdrawal for user ${userId}`,
    destination: {
      type: 'bank_account',
      account_number: provider_account
    },
    metadata: { ...metadata, userId, type: 'withdrawal' }
  };

  const res = await client.post('/transfer', payload);
  return res.data;
}

module.exports = {
  transferRelease,
  processWithdrawal
};
