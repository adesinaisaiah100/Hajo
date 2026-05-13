const axios = require('axios');
const { getEnv } = require('../../config/env');

function createSquadClient() {
  const env = getEnv();
  if (!env.SQUAD_SECRET_KEY || !env.SQUAD_API_BASE) {
    return null;
  }

  return axios.create({
    baseURL: env.SQUAD_API_BASE,
    timeout: 15000,
    headers: {
      Authorization: `Bearer ${env.SQUAD_SECRET_KEY}`,
      'Content-Type': 'application/json'
    }
  });
}

module.exports = {
  createSquadClient
};