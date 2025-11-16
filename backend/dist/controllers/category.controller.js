"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.listCategories = exports.createCategory = void 0;
const prisma_1 = require("../utils/prisma");
const createCategory = async (req, res) => {
    const userId = req.user?.userId;
    // categories are global or user-specific? I'll make them global for reuse
    try {
        const { name, icon } = req.body;
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated." });
        }
        if (!name)
            return res.status(400).json({ message: "name required" });
        const existing = await prisma_1.prisma.category.findFirst({
            where: {
                userId: userId,
                name: name
            }
        });
        if (existing)
            return res.status(409).json({ message: "Category exists" });
        const category = await prisma_1.prisma.category.create({ data: { name, icon } });
        return res.status(201).json(category);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error creating category" });
    }
};
exports.createCategory = createCategory;
const listCategories = async (req, res) => {
    try {
        const categories = await prisma_1.prisma.category.findMany({ orderBy: { name: "asc" } });
        return res.json(categories);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error listing categories" });
    }
};
exports.listCategories = listCategories;
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, icon } = req.body;
        console.log(id, name, icon, "Hereeeee");
        const category = await prisma_1.prisma.category.update({
            where: { id },
            data: { name, icon },
        });
        return res.json(category);
    }
    catch (error) {
        console.error("❌ Error updating category:", error);
        if (error.code === "P2002") {
            return res.status(400).json({ message: "Category name already exists cannot create duplicate" });
        }
        return res.status(500).json({ message: "Unable to update category as particular id doesnt exist" });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        // careful: check foreign key constraints. Option: prevent delete if transactions exist
        const txCount = await prisma_1.prisma.transaction.count({ where: { categoryId: id } });
        if (txCount > 0) {
            return res.status(400).json({ message: "Category in use by transactions. Reassign or delete transactions first." });
        }
        await prisma_1.prisma.category.delete({ where: { id } });
        return res.json({ message: "Deleted" });
    }
    catch (err) {
        console.error(err);
        return res.status(400).json({ message: "Unable to delete category" });
    }
};
exports.deleteCategory = deleteCategory;
