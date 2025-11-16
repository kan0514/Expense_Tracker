import rateLimit from "express-rate-limit";
import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

// ✅ Connect to Upstash Redis (cloud, with TLS)
const redisClient = new Redis(process.env.REDIS_URL!, {
  tls: { rejectUnauthorized: false },
});

// ✅ Use rate-limiter-flexible (modern + supports ioredis natively)
const redisLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  points: Number(process.env.RATE_LIMIT_MAX) || 5, // Number of requests
  duration: (Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000) / 1000, // Convert ms → seconds
});

const FALLBACK_IP = "anonymous_client";

export const loginRateLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
  max: Number(process.env.RATE_LIMIT_MAX) || 5,
  standardHeaders: true,
  legacyHeaders: false,

  // ✅ Custom handler integrated with rate-limiter-flexible
  handler: async (req, res) => {
    res.status(429).json({ message: "Too many login attempts, please try again later." });
  },

  keyGenerator: (req) => req.ip || FALLBACK_IP,

  // ✅ Use rate-limiter-flexible under the hood
  async skip(req, res) {
    try {
      await redisLimiter.consume(req.ip || FALLBACK_IP);
      return false;
    } catch {
      return true;
    }
  },
});
