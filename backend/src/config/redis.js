let Redis;
try {
  Redis = require('ioredis');
} catch {
  Redis = null;
}

let client = null;

function getRedis() {
  if (client) return client;
  if (!Redis) return null;

  const url = process.env.REDIS_URL || process.env.REDIS_URI;
  if (!url) return null;

  client = new Redis(url);
  client.on('error', (err) => console.error('Redis error', err));
  return client;
}

module.exports = { getRedis };
