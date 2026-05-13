const { AppError } = require('./error');
const { verifyAccessToken } = require('../utils/token');

function extractBearerToken(headerValue) {
  if (!headerValue) {
    return null;
  }

  const [scheme, token] = headerValue.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
}

function requireAuth(req, res, next) {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    return next(new AppError('Authentication required', 401));
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      role: payload.role,
      tokenVersion: payload.tokenVersion
    };
    return next();
  } catch (error) {
    return next(new AppError('Invalid or expired access token', 401));
  }
}

function requireRole(...allowedRoles) {
  return function roleGuard(req, res, next) {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to access this resource', 403));
    }

    return next();
  };
}

module.exports = {
  requireAuth,
  requireRole,
  extractBearerToken
};