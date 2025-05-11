import { prisma } from "../config/prisma";

export class CategoryRepository {
    static async getAllUniqueCategories(categoryIds: number[]) {
        const categories = await prisma.$queryRawUnsafe(`
            WITH RECURSIVE category_tree AS (
                -- Base case: Start with the given category IDs
                SELECT id, name, "parentTagId"
                FROM "Categories"
                WHERE id = ANY($1)
                UNION ALL
                -- Recursive case: Find all children of the current categories
                SELECT c.id, c.name, c."parentTagId"
                FROM "Categories" c
                INNER JOIN category_tree ct ON c."parentTagId" = ct.id
            )
            -- Select all unique categories from the tree
            SELECT DISTINCT id, name
            FROM category_tree;
        `, categoryIds);

        return categories;
    }
    
    static async getAllCategories() {
        const categories = await prisma.categories.findMany({
            include: {
                questionBank: true, // Include related question bank data
            },
        });
        return categories;
    }

    static async getCategoryById(categoryId: number) {
        const category = await prisma.categories.findUnique({
            where: {
                id: categoryId,
            },
            include: {
                questionBank: true, // Include related question bank data
            },
        });
        return category;
    }

    static async createCategory(name: string) {
        const category = await prisma.categories.create({
            data: {
                name,
            },
        });
        return category;
    }
    static async updateCategory(categoryId: number, name: string) {
        const category = await prisma.categories.update({
            where: {
                id: categoryId,
            },
            data: {
                name,
            },
        });
        return category;
    }
    static async deleteCategory(categoryId: number) {
        const category = await prisma.categories.delete({
            where: {
                id: categoryId,
            },
        });
        return category;
    }
}