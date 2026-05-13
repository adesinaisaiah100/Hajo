const dotenv = require('dotenv');
const { z } = require('zod');

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  OTP_TTL_SECONDS: z.coerce.number().default(300),
  OTP_RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  OTP_RATE_LIMIT_MAX: z.coerce.number().default(5),
  TERMII_API_KEY: z.string().optional().default(''),
  TERMII_SENDER_ID: z.string().optional().default('Hajo'),
  SQUAD_SECRET_KEY: z.string().optional().default(''),
  SQUAD_PUBLIC_KEY: z.string().optional().default(''),
  SQUAD_API_BASE: z.string().optional().default('https://sandbox-api-d.squadco.com'),
  SQUAD_ENVIRONMENT: z.string().optional().default('sandbox'),
  SQUAD_WEBHOOK_SECRET: z.string().optional().default(''),
  SQUAD_GTBANK_ACCOUNT_NUMBER: z.string().optional().default(''),
  SQUAD_MERCHANT_ID: z.string().optional().default(''),
  SUPABASE_URL: z.string().optional().default(''),
  SUPABASE_KEY: z.string().optional().default('')
});

let cachedEnv;

function getEnv() {
  if (!cachedEnv) {
    cachedEnv = envSchema.parse(process.env);
  }

  return cachedEnv;
}

module.exports = {
  getEnv
};