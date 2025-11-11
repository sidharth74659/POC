const { getRedisClient, cacheKey } = require('../util/redis.client');
const logger = require('../util/logger');

const rateLimitMiddleware = (windowMs = 60000, maxRequests = 100) => {
  return async (req, res, next) => {
    try {
      const { tenantId, userId } = req;
      
      if (!tenantId) {
        return next();
      }

      const redis = getRedisClient();
      const key = cacheKey(tenantId, 'rateLimit', userId || 'anonymous', Math.floor(Date.now() / windowMs));

      const current = await redis.incr(key);
      
      if (current === 1) {
        await redis.expire(key, Math.ceil(windowMs / 1000));
      }

      if (current > maxRequests) {
        logger.warn('Rate limit exceeded', {
          tenantId,
          userId,
          key,
          current
        });
        return res.status(429).json({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded'
        });
      }

      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - current));

      next();
    } catch (error) {
      logger.error('Rate limit middleware error', error);
      // On Redis error, allow request to proceed
      next();
    }
  };
};

module.exports = rateLimitMiddleware;

