import { CategoryRepository } from "../repositories/categoriesRepository";

export default class CategoryService {
    static async getCategoriesByIds(categoryIds: number[]) {
        const categories = await CategoryRepository.getAllUniqueCategories(categoryIds);
        return categories;
    }
}