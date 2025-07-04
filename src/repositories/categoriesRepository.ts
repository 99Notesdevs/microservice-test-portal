import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../config/prisma";

export class CategoryRepository {
    static async getAllUniqueCategories(categoryIds: number[]) {
        const categories = await prisma.$queryRawUnsafe(`
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

        return categories;
    }
    
    static async getAllCategories() {
        const categories = await prisma.categories.findMany();
        return categories;
    }

    static async getCategoryById(categoryId: number) {
        const category = await prisma.categories.findUnique({
            where: {
                id: categoryId,
            }
        });
        return category;
    }

    static async getCategoryByParentId(parentTagId: number) {
        const categories = await prisma.categories.findMany({
            where: {
                parentTagId: parentTagId,
            },
            include: {
                daughterTag: true,
            }
        });
        return categories;
    }

    static async getParentCategory(categoryId: number) {
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
        return category;
    }

    static async createCategory(name: string, pageId: number, parentTagId: number) {
        const category = await prisma.categories.create({
            data: {
                name,
                parentTagId
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
        const category = await prisma.categories.delete({
            where: {
                id: categoryId,
            },
        });
        return category;
    }
}