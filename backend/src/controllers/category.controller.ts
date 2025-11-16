// src/controllers/category.controller.ts
import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export const createCategory = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId as string | undefined;
  // categories are global or user-specific? I'll make them global for reuse
  try {
    const { name, icon } = req.body;
    if (!userId) {
             return res.status(401).json({ message: "User not authenticated." });
        }
    if (!name) return res.status(400).json({ message: "name required" });

    const existing = await prisma.category.findFirst({
            where: {
                userId: userId, 
                name: name
            } 
        });
    if (existing) return res.status(409).json({ message: "Category exists" });

    const category = await prisma.category.create({ data: { name, icon } });
    return res.status(201).json(category);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error creating category" });
  }
};

export const listCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
    return res.json(categories);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error listing categories" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, icon } = req.body;
    console.log(id,name,icon,"Hereeeee")
    const category = await prisma.category.update({
      where: { id },
      data: { name, icon },
    });
    return res.json(category);
  } catch (error: any) {
    console.error("❌ Error updating category:", error);
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Category name already exists cannot create duplicate" });
    }
    return res.status(500).json({ message: "Unable to update category as particular id doesnt exist" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // careful: check foreign key constraints. Option: prevent delete if transactions exist
    const txCount = await prisma.transaction.count({ where: { categoryId: id } });
    if (txCount > 0) {
      return res.status(400).json({ message: "Category in use by transactions. Reassign or delete transactions first." });
    }
    await prisma.category.delete({ where: { id } });
    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Unable to delete category" });
  }
};
