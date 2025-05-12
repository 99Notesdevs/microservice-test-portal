import { Request, Response } from 'express';
import CategoryService from '../services/categoryService';

export default class CategoriesController {
    static async getCategoriesByIds(req: Request, res: Response) {
        try {
            const { categoryIds } = req.body;
            if (!categoryIds || !Array.isArray(categoryIds)) {
                throw new Error('Category IDs must be provided as an array');
            }
            const categories = await CategoryService.getCategoriesByIds(categoryIds);
            res.status(200).json({ success: true, data: categories });
        } catch (error: unknown) {
            res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
        }
    }

    static async getAllCategories(req: Request, res: Response) {
        try {
            const categories = await CategoryService.getAllCategories();
            res.status(200).json({ success: true, data: categories });
        } catch (error: unknown) {
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
        }
    }

    static async getCategoryById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new Error('Category ID is required');
            }
            const category = await CategoryService.getCategoryById(Number(id));
            res.status(200).json({ success: true, data: category });
        } catch (error: unknown) {
            res.status(404).json({ success: false, message: error instanceof Error ? error.message : 'Category not found' });
        }
    }

    static async createCategory(req: Request, res: Response) {
        try {
            const { name, pageId, parentTagId } = req.body;
            if (!name) {
                throw new Error('Category name is required');
            }
            const category = await CategoryService.createCategory(name, pageId, parentTagId);
            res.status(201).json({ success: true, data: category });
        } catch (error: unknown) {
            res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
        }
    }

    static async updateCategory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            if (!id || !name) {
                throw new Error('Category ID and name are required');
            }
            const category = await CategoryService.updateCategory(Number(id), name);
            res.status(200).json({ success: true, data: category });
        } catch (error: unknown) {
            res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
        }
    }

    static async deleteCategory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new Error('Category ID is required');
            }
            const result = await CategoryService.deleteCategory(Number(id));
            res.status(200).json({ success: true, message: result.message });
        } catch (error: unknown) {
            res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
        }
    }
}