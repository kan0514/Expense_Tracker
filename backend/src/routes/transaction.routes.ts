import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createTransaction, listTransactions, updateTransaction, deleteTransaction,getTransactionSummary  } from "../controllers/transaction.controller";

const router = Router();

router.post("/", authMiddleware, createTransaction);
router.get("/", authMiddleware, listTransactions);
router.put("/:id", authMiddleware, updateTransaction);
router.delete("/:id", authMiddleware, deleteTransaction);
router.get('/summary', getTransactionSummary);

export default router;
