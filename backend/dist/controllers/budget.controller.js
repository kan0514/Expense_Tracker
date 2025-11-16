"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBudget = exports.getBudget = void 0;
const prisma_1 = require("../utils/prisma");
// GET /budgets?month=11&year=2025
const getBudget = async (req, res) => {
    const userId = req.user?.userId;
    const month = Number(req.query.month);
    const year = Number(req.query.year);
    try {
        const budget = await prisma_1.prisma.budget.findUnique({
            where: { userId_month_year: { userId, month, year } },
        });
        return res.json(budget || { amount: 0 });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error fetching budget" });
    }
};
exports.getBudget = getBudget;
// POST /budgets
const setBudget = async (req, res) => {
    const userId = req.user?.userId;
    const { month, year, amount } = req.body;
    try {
        const budget = await prisma_1.prisma.budget.upsert({
            where: { userId_month_year: { userId, month, year } },
            update: { amount },
            create: { userId, month, year, amount },
        });
        return res.json(budget);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error setting budget" });
    }
};
exports.setBudget = setBudget;
