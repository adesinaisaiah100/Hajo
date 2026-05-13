const axios = require('axios');
const { getEnv } = require('../../config/env');

function createTermiiClient() {
  const env = getEnv();

  if (!env.TERMII_API_KEY) {
    return {
      async sendOtpSms(phone, message) {
        if (env.NODE_ENV !== 'production') {
          console.info(`[TERMII:mock] ${phone}: ${message}`);
        }

        return {
          success: true,
          provider: 'mock',
          messageId: `mock-${Date.now()}`
        };
      }
    };
  }

  const client = axios.create({
    baseURL: 'https://api.termii.com/api',
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return {
    async sendOtpSms(phone, message) {
      const response = await client.post('/sms/send', {
        api_key: env.TERMII_API_KEY,
        to: phone,
        from: env.TERMII_SENDER_ID,
        sms: message,
        type: 'plain',
        channel: 'generic'
      });

      return response.data;
    }
  };
}

const termii = createTermiiClient();

module.exports = {
  createTermiiClient,
  termii
};