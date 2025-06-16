import { prisma } from "../config/prisma";

export class RatingCategoryRepository {
    static async getRating(userId: number, categoryId: number) {
        return await prisma.categoryRating.findUnique({
            where: { userId_categoryId: { userId, categoryId } },
            select: {id: true, rating: true}
        });
    }

    static async getRatingCategoryByUserId(userId: number) {
        return await prisma.categoryRating.findMany({
            where: { userId: userId },
            select: {
                categoryId: true,
                rating: true,
            },
        });
    }

    static async getRatingCategoryByCategoryId(categoryId: number) {
        return await prisma.categoryRating.findMany({
            where: { categoryId: categoryId },
        });
    }

    static async updateRatingCategory(userId: number, categoryId: number, rating: number) {
        return await prisma.categoryRating.upsert({
            where: { userId_categoryId: { userId, categoryId } },
            update: { rating },
            create: { userId, categoryId, rating }
          });
    }

    static async deleteRatingCategory(userId: number, categoryId: number) {
        return await prisma.categoryRating.delete({
            where: {
                userId_categoryId: {
                    userId,
                    categoryId,
                },
            },
        });
    }
}