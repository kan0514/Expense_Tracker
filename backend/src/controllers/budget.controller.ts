//budget.controller.ts
import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
// GET /budgets?month=11&year=2025
export const getBudget = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const month = Number(req.query.month);
  const year = Number(req.query.year);

  try {
    const budget = await prisma.budget.findUnique({
      where: { userId_month_year: { userId, month, year } },
    });
    return res.json(budget || { amount: 0 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error fetching budget" });
  }
};

// POST /budgets
export const setBudget = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { month, year, amount } = req.body;

  try {
    const budget = await prisma.budget.upsert({
      where: { userId_month_year: { userId, month, year } },
      update: { amount },
      create: { userId, month, year, amount },
    });
    return res.json(budget);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error setting budget" });
  }
};

