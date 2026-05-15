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

  // Refined payload based on Squad API Guide for Virtual Accounts
  const response = await client.post('/virtual-account', {
    customer_identifier: user.id,
    display_name: `${user.firstName} ${user.lastName}`.trim(),
    first_name: user.firstName,
    last_name: user.lastName,
    mobile_num: user.phone,
    email: user.email || `${user.phone}@hajo.ng`,
    benefit_type: 'NUBAN', // Standard for Nigerian virtual accounts
  });

  const payload = response.data?.data || response.data || {};

  return {
    accountName: payload.account_name || `${user.firstName} ${user.lastName}`.trim(),
    accountNumber: payload.account_no || payload.accountNumber || null,
    bankName: payload.bank_name || payload.bankName || 'GTBank',
    reference: payload.reference || payload.account_reference || `squad-${user.id}`,
    raw: payload
  };
}

module.exports = {
  createVirtualAccount,
  buildMockVirtualAccount
};