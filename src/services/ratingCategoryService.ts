import { RatingCategoryRepository } from '../repositories/ratingCategoryRepository';

export class RatingCategoryService {
    static async getRating(userId: number, categoryId: number) {
        return await RatingCategoryRepository.getRating(userId, categoryId);
    }

    static async getRatingCategoryByUserId(userId: number) {
        return await RatingCategoryRepository.getRatingCategoryByUserId(userId);
    }

    static async getRatingCategoryByCategoryId(categoryId: number) {
        return await RatingCategoryRepository.getRatingCategoryByCategoryId(categoryId);
    }

    static async updateRatingCategory(userId: number, categoryId: number, rating: number) {
        return await RatingCategoryRepository.updateRatingCategory(userId, categoryId, rating);
    }

    static async deleteRatingCategory(userId: number, categoryId: number) {
        return await RatingCategoryRepository.deleteRatingCategory(userId, categoryId);
    }
}