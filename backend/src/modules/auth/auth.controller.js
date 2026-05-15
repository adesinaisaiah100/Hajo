const { authService, buildAuthCookies } = require('./auth.service');
const { AppError } = require('../../middleware/error');

function setRefreshCookie(res, refreshToken) {
  const cookie = buildAuthCookies(refreshToken);
  res.cookie('sb_refresh_token', cookie.refreshToken, cookie.options);
}

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return next(error);
  }
}

async function verifyOtp(req, res, next) {
  try {
    const result = await authService.verifyOtp(req.body);
    setRefreshCookie(res, result.refreshToken);

    return res.status(200).json({
      success: true,
      data: {
        accessToken: result.accessToken,
        user: result.user
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function refresh(req, res, next) {
  try {
    const refreshToken = req.body.refreshToken || req.cookies?.sb_refresh_token;
    const result = await authService.refresh(refreshToken);
    setRefreshCookie(res, result.refreshToken);

    return res.status(200).json({
      success: true,
      data: {
        accessToken: result.accessToken,
        user: result.user
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function logout(req, res, next) {
  try {
    const userId = req.user?.id;
    await authService.logout(userId);
    res.clearCookie('sb_refresh_token', { path: '/' });

    return res.status(200).json({ success: true });
  } catch (error) {
    return next(error);
  }
}

async function me(req, res, next) {
  try {
    if (!req.user?.id) {
      throw new AppError('Authentication required', 401);
    }

    const user = await authService.getCurrentUser(req.user.id);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
}

async function verifyTier1(req, res, next) {
  try {
    const userId = req.user.id;
    const user = await authService.verifyTier1(userId, req.body);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
}

async function verifyTier2(req, res, next) {
  try {
    const userId = req.user.id;
    const user = await authService.verifyTier2(userId, req.body);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
}

async function verifyTier3(req, res, next) {
  try {
    const userId = req.user.id;
    const user = await authService.verifyTier3(userId, req.body);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  verifyOtp,
  refresh,
  logout,
  me,
  verifyTier1,
  verifyTier2,
  verifyTier3
};