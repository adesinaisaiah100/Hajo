const { z } = require('zod');

const roleSchema = z.enum(['CUSTOMER', 'PROVIDER']);

const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(6),
  email: z.string().email().optional().or(z.literal('')),
  role: roleSchema,
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  tradeName: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string().min(1)).optional(),
  yearsExperience: z.coerce.number().int().min(0).optional(),
  availability: z.string().optional(),
  priceFrom: z.coerce.number().nonnegative().optional(),
  priceTo: z.coerce.number().nonnegative().optional()
});

const loginSchema = z.object({
  phone: z.string().min(6)
});

const verifyOtpSchema = z.object({
  phone: z.string().min(6),
  otp: z.string().regex(/^\d{6}$/)
});

const refreshSchema = z.object({
  refreshToken: z.string().optional()
});

module.exports = {
  roleSchema,
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  refreshSchema
};