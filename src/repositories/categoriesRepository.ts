import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../config/prisma";
import logger from "../utils/logger";
import redis from "../config/RedisClient";

export class CategoryRepository {
    private static cacheTTL = 60 * 60;
    
    static async getAllUniqueCategories(categoryIds: number[]) {
        if (!categoryIds || categoryIds.length === 0) {
            logger.warn("No category IDs provided for fetching unique categories");
            return [];
        }
        const cacheKey = `uniqueCategories:${categoryIds.join(",")}`;
        const cachedCategories = await redis.get(cacheKey);
        if (cachedCategories) {
            logger.info(`Returning cached unique categories for IDs: ${categoryIds}`);
            return JSON.parse(cachedCategories);
        }

        logger.info(`Fetching all categories for multiple selected Ids: ${categoryIds}`);
        const categories = await prisma.$queryRawUnsafe<Array<{ id: number; name: string }>>(`
            WITH RECURSIVE category_tree AS (
                SELECT id, name, "parentTagId"      
                FROM "Categories"
                WHERE id = ANY($1::int[])
                UNION ALL
                SELECT c.id, c.name, c."parentTagId"
                FROM "Categories" c
                INNER JOIN category_tree ct ON c."parentTagId" = ct.id
            )
            SELECT DISTINCT id, name
            FROM category_tree;
        `, categoryIds);

        if (categories && categories.length > 0) {
            await redis.setex(cacheKey, this.cacheTTL, JSON.stringify(categories));
        } else {
            logger.warn(`No categories found for IDs: ${categoryIds}`);
        }
        logger.info(`Fetched categories for multiple selected Ids: ${categoryIds}`);

        return categories;
    }
    
    static async getAllCategories() {
        logger.info("Fetching all categories");
        const categories = await prisma.categories.findMany();
        return categories;
    }

    static async getCategoryById(categoryId: number) {
        logger.info(`Fetching category by ID: ${categoryId}`);
        const category = await prisma.categories.findUnique({
            where: {
                id: categoryId,
            }
        });
        if (!category) {
            logger.warn(`Category with ID ${categoryId} not found`);
            throw new Error(`Category with ID ${categoryId} not found`);
        }
        logger.info(`Fetched category by ID: ${categoryId}`);
        return category;
    }

    static async getCategoryByParentId(parentTagId: number) {
        logger.info(`Fetching categories by parent ID: ${parentTagId}`);
        const categories = await prisma.categories.findMany({
            where: {
                parentTagId: parentTagId,
            },
            include: {
                daughterTag: true,
            }
        });
        logger.info(`Fetched categories for parent ID: ${parentTagId}`);
        return categories;
    }

    static async getParentCategory(categoryId: number) {
        logger.info(`Fetching parent category for category ID: ${categoryId}`);
        const category = await prisma.categories.findFirst({
            where: {
                daughterTag: {
                    some: {
                        id: categoryId,
                    }
                }
            },
            include: {
                daughterTag: true
            }
        })
        logger.info(`Fetched parent category for category ID: ${categoryId}`);
        return category;
    }

    static async createCategory(name: string, pageId: number, parentTagId: number) {
        logger.info(`Creating category with name: ${name}, pageId: ${pageId}, parentTagId: ${parentTagId}`);
        const category = await prisma.categories.create({
            data: {
                name,
                parentTagId
            },
        });
        logger.info(`Created category with ID: ${category.id}`);
        return category;
    }
    static async updateCategory(categoryId: number, name: string) {
        logger.info(`Updating category with ID: ${categoryId} to name: ${name}`);
        const category = await prisma.categories.update({
            where: {
                id: categoryId,
            },
            data: {
                name,
            },
        });
        logger.info(`Updated category with ID: ${category.id}`);
        return category;
    }

    static async updateCategoryWeight(categoryId: number, weight: Decimal) {
        return prisma.categories.update({
            where: {
                id: categoryId,
            },
            data: {
                weight,
            },
        });
    }

    static async deleteCategory(categoryId: number) {
        logger.info(`Deleting category with ID: ${categoryId}`);
        const category = await prisma.categories.delete({
            where: {
                id: categoryId,
            },
        });
        logger.info(`Deleted category with ID: ${categoryId}`);
        return category;
    }
}