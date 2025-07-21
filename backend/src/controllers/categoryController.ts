import { Request, Response } from "express";
import { Category } from "../models/category";

//category controllers
export const categoryController = {
    create: async function(req: Request, res: Response) {
        const { name, type, icon } = req.body;
        const userId = req.auth?.userId;

        if (!name || !type || !userId) {
            return res.status(400).json({ error: "Name and type fields are required to create a category" });
        }

        try {
            const category = await Category.createCategory(userId, name, type, icon);
            return res.status(201).json(category);
        } catch (error) {
            console.error("Error creating category:", error);
            return res.status(500).json({ error: "Category creation failed" });
        }
    },

    getAll: async function(req: Request, res: Response) {
        const userId = req.auth?.userId;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        try {
            const categories = await Category.find({ userId });
            return res.status(200).json(categories);
        } catch (error) {
            console.error("Error fetching categories:", error);
            return res.status(500).json({ error: "Failed to fetch categories" });
        }
    },

    update: async function(req: Request, res: Response) {
        const { id } = req.params;
        const { name, type } = req.body;
        const userId = req.auth?.userId;

        if (!id || !name || !type || !userId) {
            return res.status(400).json({ error: "All fields are required to update a category" });
        }

        try {
            const category = await Category.findByIdAndUpdate(id, { name, type }, { new: true });

            if (!category) {
                return res.status(404).json({ error: "Category not found" });
            }

            return res.status(200).json(category);
        } catch (error) {
            console.error("Error updating category:", error);
            return res.status(500).json({ error: "Category update failed" });
        }
    },
}