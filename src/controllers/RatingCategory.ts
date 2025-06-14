import { RatingCategoryService } from "../services/ratingCategoryService";
import { Request, Response } from "express";

export class RatingCategoryController {
    static async getRating(req: Request, res: Response) {
        try{
            const { userId, categoryId } = req.params;
            const rating = await RatingCategoryService.getRating(parseInt(userId), parseInt(categoryId));
            res.status(200).json({ success: true, data: rating});
        } catch(error: unknown) {
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
        }
    }

    static async getRatingCategoryByUserId(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const categories = await RatingCategoryService.getRatingCategoryByUserId(parseInt(userId));
            res.status(200).json({ success: true, data: categories });
        } catch (error: unknown) {
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
        }
    }

    static async getRatingCategoryByCategoryId(req: Request, res: Response) {
        try {
            const { categoryId } = req.params;
            const category = await RatingCategoryService.getRatingCategoryByCategoryId(parseInt(categoryId));
            res.status(200).json({ success: true, data: category });
        } catch (error: unknown) {
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
        }
    }

    static async updateRatingCategory(req: Request, res: Response) {
        try {
            const { userId, categoryId } = req.params;
            const { rating } = req.body;
            const updatedCategory = await RatingCategoryService.updateRatingCategory(parseInt(userId), parseInt(categoryId), rating);
            res.status(200).json({ success: true, data: updatedCategory });
        } catch (error: unknown) {
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
        }
    }

    static async deleteRatingCategory(req: Request, res: Response) {
        try {
            const { userId, categoryId } = req.params;
            await RatingCategoryService.deleteRatingCategory(parseInt(userId), parseInt(categoryId));
            res.sendStatus(204);
        } catch (error: unknown) {
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
        }
    }
}