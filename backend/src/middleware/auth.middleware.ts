import jwt, { Secret } from "jsonwebtoken";
import redisClient from "../utils/redisClient.js";
import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
    user?: any; // Define the user property
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined;
  if (!token) {
    console.log("❌ No token found in Authorization header");
    return res.status(401).json({ message: "Unauthorized - Missing Token" });
  }

  try {
    // ✅ Ensure Redis is connected
    if (!redisClient.isOpen) {
      console.log("🔄 Connecting Redis...");
      await redisClient.connect();
    }

    console.log("🔹 Checking Redis cache for token...");
    const cachedUser = await redisClient.get(token);
    console.log("🧠 Cached user:", cachedUser);

    if (cachedUser) {
      console.log("✅ Found user in cache");
      req.user = JSON.parse(cachedUser);
      return next();
    }

    console.log("🧩 Verifying JWT...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret);
    console.log("✅ Decoded JWT:", decoded);

    console.log("💾 Caching user in Redis...");
    await redisClient.set(token, JSON.stringify(decoded), { EX: 3600 });

    req.user = decoded;
    console.log("✅ Authentication successful");
    next();
  } catch (err : any) {
    console.error("❌ Auth middleware error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
