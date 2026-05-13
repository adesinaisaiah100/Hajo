const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { getEnv } = require('./config/env');
const { notFound, errorHandler } = require('./middleware/error');
const authRoutes = require('./modules/auth/auth.routes');

function createApp() {
  const env = getEnv();
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.get('/health', (req, res) => {
    res.status(200).json({
      success: true,
      uptime: process.uptime(),
      status: 'ok'
    });
  });

  const bookingRoutes = require('./routes/booking.routes');
  const webhookRoutes = require('./routes/webhooks.routes');
  const reviewRoutes = require('./routes/reviews.routes');
  const transactionRoutes = require('./routes/transactions.routes');

  app.use('/api/auth', authRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/webhooks', webhookRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/transactions', transactionRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

const app = createApp();

module.exports = {
  app,
  createApp
};