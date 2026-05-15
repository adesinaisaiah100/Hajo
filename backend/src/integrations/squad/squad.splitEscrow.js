const { createSquadClient } = require('./squad.client');
const { getEnv } = require('../../config/env');

/**
 * Initiate split escrow: charge customer for materials + labour
 * In MVP (Sandbox), this mocks the initiation but uses real refs if keys exist.
 * 
 * Returns: { materialsRef, labourRef }
 */
async function initiateSplitEscrow(bookingData, materialsCost, labourCost) {
  const env = getEnv();
  const baseRef = bookingData.id ? bookingData.id.substring(0, 12) : 'test';
  const timestamp = Date.now();

  return {
    materialsRef: `MAT_${baseRef}_${timestamp}`,
    labourRef: `LAB_${baseRef}_${timestamp}`,
    breakdown: {
      materials: materialsCost,
      labour: labourCost,
      total: materialsCost + labourCost,
    },
  };
}

/**
 * Release materials portion to artisan immediately
 */
async function releaseMaterialsEscrow(materialsRef, artisanSquadAccountRef, amount) {
  const client = createSquadClient();

  if (!client) {
    console.log(`[Squad Mock] Releasing materials escrow: ref=${materialsRef}, amount=${amount}, to=${artisanSquadAccountRef}`);
    return { success: true, ref: materialsRef, type: 'materials_release', mock: true };
  }

  const payload = {
    amount: amount * 100, // Squad uses kobo
    currency: 'NGN',
    transfer_ref: materialsRef,
    narration: `Materials release: ${materialsRef}`,
    destination: {
      type: 'bank_account',
      account_number: artisanSquadAccountRef
    },
    metadata: { materialsRef, type: 'materials_release' }
  };

  const res = await client.post('/transfer', payload);
  return { ...res.data, success: res.data?.status === 'success' };
}

/**
 * Release labour portion to artisan on completion
 */
async function releaseLaborEscrow(laborRef, artisanSquadAccountRef, amount) {
  const client = createSquadClient();

  if (!client) {
    console.log(`[Squad Mock] Releasing labour escrow: ref=${laborRef}, amount=${amount}, to=${artisanSquadAccountRef}`);
    return { success: true, ref: laborRef, type: 'labour_release', mock: true };
  }

  const payload = {
    amount: amount * 100, // Squad uses kobo
    currency: 'NGN',
    transfer_ref: laborRef,
    narration: `Labour release: ${laborRef}`,
    destination: {
      type: 'bank_account',
      account_number: artisanSquadAccountRef
    },
    metadata: { laborRef, type: 'labour_release' }
  };

  const res = await client.post('/transfer', payload);
  return { ...res.data, success: res.data?.status === 'success' };
}

/**
 * Force release labour escrow (48-hour timeout)
 */
async function forceReleaseLaborEscrow(laborRef, artisanSquadAccountRef, amount) {
  const result = await releaseLaborEscrow(laborRef, artisanSquadAccountRef, amount);
  return { ...result, reason: 'timeout_48h' };
}

module.exports = {
  initiateSplitEscrow,
  releaseMaterialsEscrow,
  releaseLaborEscrow,
  forceReleaseLaborEscrow,
};
