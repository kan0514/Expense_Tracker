// file: src/routes/budget.routes.ts

import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { getBudget,setBudget } from "../controllers/budget.controller";

const router = Router();

router.get("/", authenticate, getBudget);
router.post("/", authenticate, setBudget);


export default router;