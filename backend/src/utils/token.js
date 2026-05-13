const jwt = require('jsonwebtoken');
const { getEnv } = require('../config/env');

function buildTokenPayload(user) {
  return {
    sub: user.id,
    role: user.role,
    tokenVersion: user.tokenVersion ?? 0
  };
}

function signAccessToken(user) {
  const env = getEnv();
  return jwt.sign(buildTokenPayload(user), env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN
  });
}

function signRefreshToken(user) {
  const env = getEnv();
  return jwt.sign(buildTokenPayload(user), env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN
  });
}

function verifyAccessToken(token) {
  const env = getEnv();
  return jwt.verify(token, env.JWT_SECRET);
}

function verifyRefreshToken(token) {
  const env = getEnv();
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};