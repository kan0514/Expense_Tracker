import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createCategory, listCategories, updateCategory, deleteCategory } from "../controllers/category.controller";

const router = Router();

// allow only authenticated users to create categories (or you can allow public list)
router.post("/", authenticate, createCategory);
router.get("/", authenticate, listCategories);
router.put("/:id", authenticate, updateCategory);
router.delete("/:id", authenticate, deleteCategory);

export default router;
