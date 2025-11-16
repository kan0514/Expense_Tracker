// file: src/index.ts

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Recommended for frontend-backend separation
import authRoutes from './routes/auth.routes';
import dashboardRoutes from './routes/dashboard.routes';
import categoryRoutes from "./routes/category.routes";
import transactionRoutes from "./routes/transaction.routes";
import budgetRoutes from "./routes/budget.routes";


// 1. Configuration & Environment Setup
dotenv.config();

// 2. App Initialization
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Global Middleware
app.use(express.json()); // To parse JSON bodies
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*', // Set a specific origin in production!
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

// Basic Health Check Route
app.get('/', (_, res) => res.send('Server is running!'))

// 4. Routes
// Mount the authentication routes
app.use('/api/v1/auth', authRoutes);

// Mount the protected dashboard routes
app.use('/api/v1', dashboardRoutes);

app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/budgets", budgetRoutes);


// 5. Server Start
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});