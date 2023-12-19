const setRateLimit = require('express-rate-limit');

// Rate limit middleware
const rateLimitMiddleware = setRateLimit({
  windowMs: 60 * 1000,
  max: 2,
  message: 'You have exceeded your 2 requests per minute limit.',
  headers: true,
});

module.exports = rateLimitMiddleware;
