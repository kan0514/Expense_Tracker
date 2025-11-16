"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL,
    socket: {
        tls: true, // required for rediss://
    },
});
redisClient.on("connect", () => {
    console.log("✅ Connected to Upstash Redis");
});
redisClient.on("error", (err) => {
    console.error("❌ Redis connection error:", err);
});
(async () => {
    if (!redisClient.isOpen)
        await redisClient.connect();
})();
exports.default = redisClient;
