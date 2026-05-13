const { createSquadClient } = require('./squad.client');

function buildMockVirtualAccount(user) {
  const suffix = String(user.phone || user.id)
    .replace(/\D/g, '')
    .slice(-10)
    .padStart(10, '0');

  return {
    accountName: `${user.firstName} ${user.lastName}`.trim(),
    accountNumber: suffix,
    bankName: 'Squad (mock)',
    reference: `mock-${user.id}`,
    raw: null
  };
}

async function createVirtualAccount(user) {
  const client = createSquadClient();

  if (!client) {
    return buildMockVirtualAccount(user);
  }

  const response = await client.post('/virtual-account', {
    customer_identifier: user.id,
    display_name: `${user.firstName} ${user.lastName}`.trim(),
    mobile_num: user.phone,
    email: user.email || undefined
  });

  const payload = response.data?.data || response.data || {};

  return {
    accountName: payload.account_name || `${user.firstName} ${user.lastName}`.trim(),
    accountNumber: payload.account_no || payload.accountNumber || null,
    bankName: payload.bank_name || payload.bankName || 'Squad',
    reference: payload.reference || payload.account_reference || `squad-${user.id}`,
    raw: payload
  };
}

module.exports = {
  createVirtualAccount,
  buildMockVirtualAccount
};