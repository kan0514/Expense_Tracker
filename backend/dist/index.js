"use strict";
// file: src/index.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors")); // Recommended for frontend-backend separation
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const transaction_routes_1 = __importDefault(require("./routes/transaction.routes"));
const budget_routes_1 = __importDefault(require("./routes/budget.routes"));
// 1. Configuration & Environment Setup
dotenv_1.default.config();
// 2. App Initialization
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// 3. Global Middleware
app.use(express_1.default.json()); // To parse JSON bodies
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || '*', // Set a specific origin in production!
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
// Basic Health Check Route
app.get('/', (_, res) => res.send('Server is running!'));
// 4. Routes
// Mount the authentication routes
app.use('/api/v1/auth', auth_routes_1.default);
// Mount the protected dashboard routes
app.use('/api/v1', dashboard_routes_1.default);
app.use("/api/v1/categories", category_routes_1.default);
app.use("/api/v1/transactions", transaction_routes_1.default);
app.use("/api/v1/budgets", budget_routes_1.default);
// 5. Server Start
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
