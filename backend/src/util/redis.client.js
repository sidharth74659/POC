const redis = require('redis');
const logger = require('./logger');

let redisClient = null;

const initRedis = async () => {
  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error', err);
    });

    redisClient.on('connect', () => {
      logger.info('Redis Client Connected');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.error('Failed to initialize Redis', error);
    throw error;
  }
};

const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
};

const cacheKey = (tenantId, ...parts) => {
  return `tenant:${tenantId}:${parts.join(':')}`;
};

module.exports = {
  initRedis,
  getRedisClient,
  cacheKey
};

