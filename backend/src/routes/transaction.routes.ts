import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createTransaction, listTransactions, updateTransaction, deleteTransaction,getTransactionSummary  } from "../controllers/transaction.controller";

const router = Router();

router.post("/", authenticate, createTransaction);
router.get("/", authenticate, listTransactions);
router.put("/:id", authenticate, updateTransaction);
router.delete("/:id", authenticate, deleteTransaction);
router.get('/summary', getTransactionSummary);

export default router;
