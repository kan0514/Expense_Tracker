// file: src/routes/dashboard.routes.ts

import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getDashboard } from "../controllers/dashboard.controller";

const router = Router();

router.get("/dashboard", authMiddleware, getDashboard);

export default router;