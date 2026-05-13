const { AppError } = require('../../middleware/error');
const { getPrismaClient } = require('../../config/database');
const { getEnv } = require('../../config/env');
const { createVirtualAccount } = require('../../integrations/squad/squad.virtualAccount');
const { termii } = require('../../integrations/termii/termii.sms');
const { generateOtp, storeOtp, verifyOtp: verifyStoredOtp } = require('../../utils/otpStore');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../../utils/token');

function normalizePhone(phone) {
  return String(phone).trim().replace(/\s+/g, '');
}

function toDecimalInput(value) {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  return Number(value).toFixed(2);
}

function mapUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    phone: user.phone,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    isVerified: user.isVerified,
    city: user.city,
    state: user.state,
    country: user.country,
    squadAccountNo: user.squadAccountNo,
    squadAccountRef: user.squadAccountRef,
    tokenVersion: user.tokenVersion,
    provider: user.provider
      ? {
          id: user.provider.id,
          tradeName: user.provider.tradeName,
          bio: user.provider.bio,
          skills: user.provider.skills,
          yearsExperience: user.provider.yearsExperience,
          priceFrom: user.provider.priceFrom,
          priceTo: user.provider.priceTo,
          availability: user.provider.availability,
          verificationStatus: user.provider.verificationStatus
        }
      : null
  };
}

function mapAuthResponse(user, refreshToken) {
  return {
    accessToken: signAccessToken(user),
    refreshToken,
    user: mapUser(user)
  };
}

function buildAuthCookies(refreshToken) {
  const env = getEnv();

  return {
    options: {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7
    },
    refreshToken
  };
}

function sendOtpMessage(phone, otp) {
  const env = getEnv();
  const message = `Your Hajo code is ${otp}`;

  if (!env.TERMII_API_KEY) {
    if (env.NODE_ENV !== 'production') {
      console.info(`[OTP:mock] ${phone}: ${otp}`);
    }
    return Promise.resolve({ success: true, provider: 'mock' });
  }

  return termii.sendOtpSms(phone, message);
}

function createAuthService({ prisma = getPrismaClient() } = {}) {
  async function ensureProviderProfile(userId, payload) {
    if (!payload || payload.role !== 'PROVIDER') {
      return null;
    }

    const providerData = {
      userId,
      tradeName: payload.tradeName || `${payload.firstName} ${payload.lastName}`,
      bio: payload.bio || null,
      skills: payload.skills || [],
      yearsExperience: payload.yearsExperience || 0,
      priceFrom: toDecimalInput(payload.priceFrom),
      priceTo: toDecimalInput(payload.priceTo),
      availability: payload.availability || null
    };

    return prisma.provider.upsert({
      where: { userId },
      update: providerData,
      create: providerData
    });
  }

  async function persistVirtualAccount(user) {
    if (user.squadAccountNo) {
      return user;
    }

    const virtualAccount = await createVirtualAccount(user);

    return prisma.user.update({
      where: { id: user.id },
      data: {
        squadAccountNo: virtualAccount.accountNumber,
        squadAccountRef: virtualAccount.reference
      },
      include: { provider: true }
    });
  }

  async function sendVerificationOtp(payload) {
    const phone = normalizePhone(payload.phone);
    const otp = generateOtp();
    const env = getEnv();

    storeOtp(phone, otp, env.OTP_TTL_SECONDS * 1000);
    await sendOtpMessage(phone, otp);

    return {
      phone,
      otpDelivered: true,
      otpExpiresInSeconds: env.OTP_TTL_SECONDS,
      debugOtp: env.NODE_ENV === 'test' ? otp : undefined
    };
  }

  async function register(payload) {
    const phone = normalizePhone(payload.phone);
    const existingUser = await prisma.user.findUnique({
      where: { phone },
      include: { provider: true }
    });

    const user = existingUser
      ? await prisma.user.update({
          where: { phone },
          data: {
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email || null,
            role: payload.role,
            city: payload.city || null,
            state: payload.state || null,
            country: payload.country || 'Nigeria'
          },
          include: { provider: true }
        })
      : await prisma.user.create({
          data: {
            phone,
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email || null,
            role: payload.role,
            city: payload.city || null,
            state: payload.state || null,
            country: payload.country || 'Nigeria'
          },
          include: { provider: true }
        });

    const provider = await ensureProviderProfile(user.id, payload);
    if (provider) {
      user.provider = provider;
    }

    const otpResult = await sendVerificationOtp({ phone });

    return {
      user: mapUser(user),
      ...otpResult
    };
  }

  async function login(payload) {
    const phone = normalizePhone(payload.phone);
    const user = await prisma.user.findUnique({
      where: { phone },
      include: { provider: true }
    });

    if (!user) {
      throw new AppError('No account found for that phone number', 404);
    }

    const otpResult = await sendVerificationOtp({ phone });

    return {
      user: mapUser(user),
      ...otpResult
    };
  }

  async function verifyOtp(payload) {
    const phone = normalizePhone(payload.phone);
    const otpCheck = verifyStoredOtp(phone, payload.otp);

    if (!otpCheck.valid) {
      throw new AppError(otpCheck.reason || 'Invalid OTP', 400);
    }

    const user = await prisma.user.findUnique({
      where: { phone },
      include: { provider: true }
    });

    if (!user) {
      throw new AppError('No account found for that phone number', 404);
    }

    const verifiedUser = await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
      include: { provider: true }
    });

    const userWithWallet = await persistVirtualAccount(verifiedUser);
    const refreshToken = signRefreshToken(userWithWallet);

    return mapAuthResponse(userWithWallet, refreshToken);
  }

  async function refresh(refreshToken) {
    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    const payload = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { provider: true }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if ((user.tokenVersion || 0) !== (payload.tokenVersion || 0)) {
      throw new AppError('Refresh token has been revoked', 401);
    }

    const nextRefreshToken = signRefreshToken(user);
    return mapAuthResponse(user, nextRefreshToken);
  }

  async function logout(userId) {
    if (!userId) {
      return { success: true };
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        tokenVersion: {
          increment: 1
        }
      }
    });

    return { success: true };
  }

  async function getCurrentUser(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { provider: true }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return mapUser(user);
  }

  return {
    register,
    login,
    verifyOtp,
    refresh,
    logout,
    getCurrentUser,
    sendVerificationOtp,
    ensureProviderProfile,
    persistVirtualAccount,
    mapUser
  };
}

const authService = createAuthService();

module.exports = {
  createAuthService,
  authService,
  mapUser,
  mapAuthResponse,
  buildAuthCookies,
  normalizePhone,
  toDecimalInput
};