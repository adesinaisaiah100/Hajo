const crypto = require('crypto');

const otpStore = new Map();

function generateOtp(length = 6) {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return String(crypto.randomInt(min, max + 1));
}

function hashOtp(otp) {
  return crypto.createHash('sha256').update(String(otp)).digest('hex');
}

function storeOtp(phone, otp, ttlMs) {
  otpStore.set(phone, {
    hash: hashOtp(otp),
    expiresAt: Date.now() + ttlMs,
    attempts: 0
  });
}

function verifyOtp(phone, otp) {
  const record = otpStore.get(phone);

  if (!record) {
    return { valid: false, reason: 'OTP not found' };
  }

  if (record.expiresAt < Date.now()) {
    otpStore.delete(phone);
    return { valid: false, reason: 'OTP expired' };
  }

  const isValid = record.hash === hashOtp(otp);

  if (!isValid) {
    record.attempts += 1;
    otpStore.set(phone, record);
    return { valid: false, reason: 'OTP mismatch' };
  }

  otpStore.delete(phone);
  return { valid: true };
}

function clearOtp(phone) {
  otpStore.delete(phone);
}

module.exports = {
  otpStore,
  generateOtp,
  hashOtp,
  storeOtp,
  verifyOtp,
  clearOtp
};