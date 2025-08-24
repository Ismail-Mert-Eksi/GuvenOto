
const rateLimit = require('express-rate-limit');

// Dinamik limiter
const dynamicRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dk
  max: (req) => {
    if (req.user && req.user.role === 'admin') return Number.MAX_SAFE_INTEGER;
    return 300; // diğerleri
  },
  keyGenerator: (req) => {
    return req.user?.username ? `user:${req.user.username}` : `ip:${req.ip}`;
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Login için özel limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 15 dk'da en fazla 20 login denemesi
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { dynamicRateLimiter, loginLimiter };
