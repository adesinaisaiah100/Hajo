const { runEscrowTimeoutJob } = require('./escrowTimeout.job');
const { runScoreRefreshJob } = require('./scoreRefresh.job');
const { runPendingTimeoutJob } = require('./pendingTimeout.job');
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

  // Run pending timeout job every hour
  cron.schedule('30 * * * *', async () => {
    console.log('[Jobs] Running pending timeout job');
    try {
      await runPendingTimeoutJob();
    } catch (error) {
      console.error('[Jobs] Pending timeout job failed:', error);
    }
  });

  cron.schedule('0 2 * * *', async () => {
    console.log('[Jobs] Running score refresh job');
    try {
      await runScoreRefreshJob();
    } catch (error) {
      console.error('[Jobs] Score refresh job failed:', error);
    }
  });

  console.log('[Jobs] Bootstrapped cron jobs');
}

module.exports = {
  bootstrapJobs
};