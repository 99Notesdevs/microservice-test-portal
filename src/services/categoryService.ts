import { CategoryRepository } from "../repositories/categoriesRepository";

export default class CategoryService {
    static async getCategoriesByIds(categoryIds: number[]) {
        const categories = await CategoryRepository.getAllUniqueCategories(categoryIds);
        return categories;
    }

    static async getAllCategories() {
        const categories = await CategoryRepository.getAllCategories();
        return categories;
    }

    static async getCategoryById(categoryId: number) {
        const category = await CategoryRepository.getCategoryById(categoryId);
        if (!category) {
            throw new Error(`Category with ID ${categoryId} not found`);
        }
        return category;
    }

    static async createCategory(name: string) {
        const category = await CategoryRepository.createCategory(name);
        return category;
    }

    static async updateCategory(categoryId: number, name: string) {
        const category = await CategoryRepository.updateCategory(categoryId, name);
        return category;
    }

    static async deleteCategory(categoryId: number) {
        await CategoryRepository.deleteCategory(categoryId);
        return { message: `Category with ID ${categoryId} deleted successfully` };
    }
}