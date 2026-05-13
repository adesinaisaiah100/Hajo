const { runEscrowTimeoutJob } = require('./escrowTimeout.job');
const cron = require('node-cron');

function bootstrapJobs() {
  // Run escrow timeout job every hour
  cron.schedule('0 * * * *', async () => {
    console.log('[Jobs] Running escrow timeout job');
    try {
      await runEscrowTimeoutJob();
    } catch (error) {
      console.error('[Jobs] Escrow timeout job failed:', error);
    }
  });

  console.log('[Jobs] Bootstrapped cron jobs');
}

module.exports = {
  bootstrapJobs
};