import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createCategory, listCategories, updateCategory, deleteCategory } from "../controllers/category.controller";

const router = Router();

// allow only authenticated users to create categories (or you can allow public list)
router.post("/", authMiddleware, createCategory);
router.get("/", authMiddleware, listCategories);
router.put("/:id", authMiddleware, updateCategory);
router.delete("/:id", authMiddleware, deleteCategory);

export default router;
