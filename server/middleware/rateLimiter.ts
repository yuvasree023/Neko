import rateLimit from 'express-rate-limit';

export const geminiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each IP/User to 30 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    reply: "Momo is catching her breath! Please wait a few moments before sending more thoughts.",
    character: {
      emotion: 'tired',
      action: 'lie',
      expression: 'tired',
      sound: 'phew...',
      intensity: 0.5,
    },
    error: 'Too Many Requests',
  },
});
