import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt";
import  redis  from "../utils/redisClient";
import dotenv from "dotenv";

dotenv.config();

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

export const register = async (req: Request, res: Response) => {
  const { name, email, password, profileUrl } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, profileUrl }
    });
    return res.status(201).json({ id: user.id, email: user.email, name: user.name, profileUrl: user.profileUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken({ userId: user.id, email: user.email, name: user.name });
    // store session in Redis with expiry similar to JWT expiry (parse expiry TTL)
    // For demo: set TTL = 1 hour (3600 sec) or derive from JWT_EXPIRY
    await redis.set(`session:${user.id}`, token, "EX", 3600);
    // store auth session in DB (optional)
    const decoded: any = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const jti = decoded.jti;
    await prisma.authSession.create({
      data: {
        userId: user.id,
        jwtId: jti,
        expiresAt: new Date(Date.now() + 3600 * 1000)
      }
    });

    return res.json({ token, user: { id: user.id, email: user.email, name: user.name, profileUrl: user.profileUrl } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return res.status(400).json({ message: "No token" });
    const token = authHeader.split(" ")[1];

    const decoded: any = require("jsonwebtoken").decode(token);
    if (!decoded?.jti) return res.status(400).json({ message: "Invalid token" });

    const jti = decoded.jti;
    // blacklist token in Redis with expiry (token TTL)
    const ttl = 3600; // seconds; ideally parse from token exp - iat
    await redis.set(`jwt:blacklist:${jti}`, "1", "EX", ttl);

    // remove session entry
    const userId = decoded.userId;
    if (userId) await redis.del(`session:${userId}`);

    // Optionally delete AuthSession in DB or mark invalid (left as exercise)
    await prisma.authSession.deleteMany({ where: { jwtId: jti } });

    return res.json({ message: "Logged out" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
