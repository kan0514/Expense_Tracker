"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const prisma_1 = require("../utils/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
const redisClient_1 = __importDefault(require("../utils/redisClient"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;
const register = async (req, res) => {
    const { name, email, password, profileUrl } = req.body;
    try {
        const existing = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (existing)
            return res.status(409).json({ message: "Email already registered" });
        const hashed = await bcrypt_1.default.hash(password, SALT_ROUNDS);
        const user = await prisma_1.prisma.user.create({
            data: { name, email, password: hashed, profileUrl }
        });
        return res.status(201).json({ id: user.id, email: user.email, name: user.name, profileUrl: user.profileUrl });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(401).json({ message: "Invalid credentials" });
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match)
            return res.status(401).json({ message: "Invalid credentials" });
        const token = (0, jwt_1.signToken)({ userId: user.id, email: user.email, name: user.name });
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            // This should ideally not happen if signToken is correct, but added for safety
            return res.status(500).json({ message: "Internal token generation error" });
        }
        const decodedPayload = Buffer.from(tokenParts[1], 'base64').toString();
        const decoded = JSON.parse(decodedPayload);
        // store session in Redis with expiry similar to JWT expiry (parse expiry TTL)
        // For demo: set TTL = 1 hour (3600 sec) or derive from JWT_EXPIRY
        await redisClient_1.default.set(`session:${user.id}`, token, { EX: 3600 });
        // store auth session in DB (optional)
        const jti = decoded.jti;
        if (jti) {
            await prisma_1.prisma.authSession.create({
                data: {
                    userId: user.id,
                    jwtId: jti,
                    expiresAt: new Date(Date.now() + 3600 * 1000)
                }
            });
        }
        return res.json({ token, user: { id: user.id, email: user.email, name: user.name, profileUrl: user.profileUrl } });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader?.startsWith("Bearer "))
            return res.status(400).json({ message: "No token" });
        const token = authHeader.split(" ")[1];
        const decoded = require("jsonwebtoken").decode(token);
        if (!decoded?.jti)
            return res.status(400).json({ message: "Invalid token" });
        const jti = decoded.jti;
        // blacklist token in Redis with expiry (token TTL)
        const ttl = 3600; // seconds; ideally parse from token exp - iat
        await redisClient_1.default.set(`jwt:blacklist:${jti}`, "1", { EX: ttl });
        // remove session entry
        const userId = decoded.userId;
        if (userId)
            await redisClient_1.default.del(`session:${userId}`);
        // Optionally delete AuthSession in DB or mark invalid (left as exercise)
        await prisma_1.prisma.authSession.deleteMany({ where: { jwtId: jti } });
        return res.json({ message: "Logged out" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.logout = logout;
