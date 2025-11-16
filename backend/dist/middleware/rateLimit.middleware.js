"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// ✅ Connect to Upstash Redis (cloud, with TLS)
const redisClient = new ioredis_1.default(process.env.REDIS_URL, {
    tls: { rejectUnauthorized: false },
});
// ✅ Use rate-limiter-flexible (modern + supports ioredis natively)
const redisLimiter = new rate_limiter_flexible_1.RateLimiterRedis({
    storeClient: redisClient,
    points: Number(process.env.RATE_LIMIT_MAX) || 5, // Number of requests
    duration: (Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000) / 1000, // Convert ms → seconds
});
const FALLBACK_IP = "anonymous_client";
exports.loginRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
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
        }
        catch {
            return true;
        }
    },
});
