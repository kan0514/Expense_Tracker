"use strict";
// file: src/routes/budget.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const budget_controller_1 = require("../controllers/budget.controller");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authMiddleware, budget_controller_1.getBudget);
router.post("/", auth_middleware_1.authMiddleware, budget_controller_1.setBudget);
exports.default = router;
