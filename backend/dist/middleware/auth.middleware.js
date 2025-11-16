"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redisClient_js_1 = __importDefault(require("../utils/redisClient.js"));
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined;
    if (!token) {
        console.log("❌ No token found in Authorization header");
        return res.status(401).json({ message: "Unauthorized - Missing Token" });
    }
    try {
        // ✅ Ensure Redis is connected
        if (!redisClient_js_1.default.isOpen) {
            console.log("🔄 Connecting Redis...");
            await redisClient_js_1.default.connect();
        }
        console.log("🔹 Checking Redis cache for token...");
        const cachedUser = await redisClient_js_1.default.get(token);
        console.log("🧠 Cached user:", cachedUser);
        if (cachedUser) {
            console.log("✅ Found user in cache");
            req.user = JSON.parse(cachedUser);
            return next();
        }
        console.log("🧩 Verifying JWT...");
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log("✅ Decoded JWT:", decoded);
        console.log("💾 Caching user in Redis...");
        await redisClient_js_1.default.set(token, JSON.stringify(decoded), { EX: 3600 });
        req.user = decoded;
        console.log("✅ Authentication successful");
        next();
    }
    catch (err) {
        console.error("❌ Auth middleware error:", err.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.authMiddleware = authMiddleware;
