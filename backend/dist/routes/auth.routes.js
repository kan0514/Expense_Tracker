"use strict";
// file: src/routes/auth.routes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware"); // Assuming path
const rateLimit_middleware_1 = require("../middleware/rateLimit.middleware"); // Assuming path
const validation_middleware_1 = require("../middleware/validation.middleware"); // Assuming path
const joi_1 = __importDefault(require("joi")); // NOTE: Joi must be installed (npm install joi)
const supabaseClient_1 = require("../utils/supabaseClient");
const router = (0, express_1.Router)();
// --- Joi Schemas (for validation) ---
const registerSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().min(6).required(),
    profileUrl: joi_1.default.string().uri().optional(),
});
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
// -------------------------------------
router.get('/test', async (req, res) => {
    const { data, error } = await supabaseClient_1.supabase.from('users').select('*');
    if (error)
        return res.status(500).json({ error: error.message });
    res.json({ users: data });
});
router.post("/register", (0, validation_middleware_1.validate)(registerSchema), auth_controller_1.register);
router.post("/login", rateLimit_middleware_1.loginRateLimiter, (0, validation_middleware_1.validate)(loginSchema), auth_controller_1.login);
router.post("/logout", auth_middleware_1.authMiddleware, auth_controller_1.logout); // Logout requires a valid token
exports.default = router;
