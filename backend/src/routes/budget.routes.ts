// file: src/routes/budget.routes.ts

import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { getBudget,setBudget } from "../controllers/budget.controller";

const router = Router();

router.get("/", authMiddleware, getBudget);
router.post("/", authMiddleware, setBudget);


export default router;