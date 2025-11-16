"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionSummary = exports.listTransactions = exports.deleteTransaction = exports.updateTransaction = exports.createTransaction = void 0;
const prisma_1 = require("../utils/prisma");
const createTransaction = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const body = req.body;
        const transactions = Array.isArray(body) ? body : [body];
        const created = [];
        for (const tx of transactions) {
            const { categoryId, amount, type, description, createdAt } = tx;
            if (!categoryId || amount == null || !type)
                continue;
            const cat = await prisma_1.prisma.category.findUnique({ where: { id: categoryId } });
            if (!cat)
                continue;
            const newTx = await prisma_1.prisma.transaction.create({
                data: {
                    userId,
                    categoryId,
                    amount: Number(amount),
                    type: type.toUpperCase(),
                    description,
                    createdAt: createdAt ? new Date(createdAt) : undefined,
                },
                include: { category: true },
            });
            created.push(newTx);
        }
        return res.status(201).json(created);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error creating transactions" });
    }
};
exports.createTransaction = createTransaction;
const updateTransaction = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;
        const body = req.body;
        // ensure transaction belongs to user
        const existing = await prisma_1.prisma.transaction.findUnique({ where: { id } });
        if (!existing || existing.userId !== userId)
            return res.status(404).json({ message: "Not found" });
        const tx = await prisma_1.prisma.transaction.update({
            where: { id },
            data: {
                categoryId: body.categoryId ?? existing.categoryId,
                amount: body.amount != null ? Number(body.amount) : existing.amount,
                type: body.type ? body.type.toUpperCase() : existing.type,
                description: body.description ?? existing.description,
                createdAt: body.createdAt ? new Date(body.createdAt) : undefined,
            },
        });
        return res.json(tx);
    }
    catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Unable to update transaction" });
    }
};
exports.updateTransaction = updateTransaction;
const deleteTransaction = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;
        const existing = await prisma_1.prisma.transaction.findUnique({ where: { id } });
        if (!existing || existing.userId !== userId)
            return res.status(404).json({ message: "Not found" });
        await prisma_1.prisma.transaction.delete({ where: { id } });
        return res.json({ message: "Deleted" });
    }
    catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Unable to delete transaction" });
    }
};
exports.deleteTransaction = deleteTransaction;
/**
 * Listing with pagination and filters:
 * Query params:
 *  - page (default 1)
 *  - perPage (default 20)
 *  - startDate, endDate (ISO)
 *  - categoryId
 *  - minAmount, maxAmount
 *  - type (INCOME/EXPENSE)
 */
const listTransactions = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const page = Math.max(Number(req.query.page) || 1, 1);
        const perPage = Math.min(Number(req.query.perPage) || 20, 100);
        const where = { userId };
        if (req.query.categoryId)
            where.categoryId = String(req.query.categoryId);
        if (req.query.type)
            where.type = String(req.query.type).toUpperCase();
        if (req.query.startDate || req.query.endDate) {
            where.createdAt = {};
            if (req.query.startDate)
                where.createdAt.gte = new Date(String(req.query.startDate));
            if (req.query.endDate)
                where.createdAt.lte = new Date(String(req.query.endDate));
        }
        if (req.query.minAmount || req.query.maxAmount) {
            where.amount = {};
            if (req.query.minAmount)
                where.amount.gte = Number(req.query.minAmount);
            if (req.query.maxAmount)
                where.amount.lte = Number(req.query.maxAmount);
        }
        const [total, transactions] = await Promise.all([
            prisma_1.prisma.transaction.count({ where }),
            prisma_1.prisma.transaction.findMany({
                where,
                include: { category: true },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * perPage,
                take: perPage,
            }),
        ]);
        return res.json({
            meta: {
                total,
                page,
                perPage,
                totalPages: Math.ceil(total / perPage),
            },
            data: transactions,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error listing transactions" });
    }
};
exports.listTransactions = listTransactions;
// GET /transactions/summary total balance 
const getTransactionSummary = async (req, res) => {
    try {
        const userId = req.user?.userId;
        // Fetch all transactions for the user
        const transactions = await prisma_1.prisma.transaction.findMany({
            where: { userId },
        });
        // Calculate total balance
        const totalBalance = transactions.reduce((sum, t) => sum + (t.type === "EXPENSE" ? -t.amount : t.amount), 0);
        // Calculate transaction count
        const transactionCount = transactions.length;
        return res.json({ totalBalance, transactionCount });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error fetching summary" });
    }
};
exports.getTransactionSummary = getTransactionSummary;
