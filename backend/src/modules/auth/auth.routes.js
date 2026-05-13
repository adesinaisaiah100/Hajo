const express = require('express');
const rateLimit = require('express-rate-limit');
const { validate } = require('../../middleware/validate');
const { requireAuth } = require('../../middleware/auth');
const { getEnv } = require('../../config/env');
const { register, login, verifyOtp, refresh, logout, me } = require('./auth.controller');
const { registerSchema, loginSchema, verifyOtpSchema, refreshSchema } = require('./auth.schemas');

const router = express.Router();
const env = getEnv();

const otpLimiter = rateLimit({
  windowMs: env.OTP_RATE_LIMIT_WINDOW_MS,
  limit: env.OTP_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many OTP requests. Please try again later.'
  }
});

router.post('/register', otpLimiter, validate({ body: registerSchema }), register);
router.post('/login', otpLimiter, validate({ body: loginSchema }), login);
router.post('/verify-otp', otpLimiter, validate({ body: verifyOtpSchema }), verifyOtp);
router.post('/refresh', validate({ body: refreshSchema }), refresh);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, me);

module.exports = router;