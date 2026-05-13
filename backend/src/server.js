const { app } = require('./app');
const { getEnv } = require('./config/env');
const { connectDatabase, disconnectDatabase } = require('./config/database');
const { bootstrapJobs } = require('./jobs');

async function startServer() {
  const env = getEnv();
  await connectDatabase();
  bootstrapJobs();

  const server = app.listen(env.PORT, () => {
    console.log(`Hajo backend listening on port ${env.PORT}`);
  });

  const shutdown = async (signal) => {
    console.log(`Received ${signal}, shutting down backend...`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  return server;
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Failed to start backend server', error);
    process.exit(1);
  });
}

module.exports = {
  startServer
};