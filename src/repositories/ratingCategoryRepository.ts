import { prisma } from "../config/prisma";
import logger from "../utils/logger";

export class RatingCategoryRepository {
    static async getRating(userId: number, categoryId: number) {
        logger.info(`Fetching rating for user ${userId} and category ${categoryId}`);
        return await prisma.categoryRating.findUnique({
            where: { userId_categoryId: { userId, categoryId } },
            select: {categoryId: true, rating: true}
        });
    }

    static async getRatingCategoryByUserId(userId: number) {
        logger.info(`Fetching rating categories for user ${userId}`);
        return await prisma.categoryRating.findMany({
            where: {
                userId: userId,
                category: {
                    parentTagId: null,
                },
            },
            select: {
                categoryId: true,
                rating: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                        daughterTag: {
                            where: {
                                CategoryRatings: {
                                    some: {
                                        userId: userId,
                                    },
                                },
                            },
                            select: {
                                id: true,
                                name: true,
                                parentTagId: true,
                                CategoryRatings: {
                                    where: {
                                        userId: userId,
                                    },
                                    select: {
                                        rating: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }

    static async getRatingCategoryByCategoryId(categoryId: number) {
        logger.info(`Fetching rating categories for category ${categoryId}`);
        return await prisma.categoryRating.findMany({
            where: { categoryId: categoryId },
        });
    }

    static async updateRatingCategory(userId: number, categoryId: number, rating: number) {
        logger.info(`Updating rating for user ${userId} and category ${categoryId}`);
        return await prisma.categoryRating.upsert({
            where: { userId_categoryId: { userId, categoryId } },
            update: { rating },
            create: { userId, categoryId, rating }
          });
    }

    static async deleteRatingCategory(userId: number, categoryId: number) {
        logger.info(`Deleting rating for user ${userId} and category ${categoryId}`);
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