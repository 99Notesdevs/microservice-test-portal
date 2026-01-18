"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const categoriesRepository_1 = require("../repositories/categoriesRepository");
class CategoryService {
    static getCategoriesByIds(categoryIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield categoriesRepository_1.CategoryRepository.getAllUniqueCategories(categoryIds);
            return categories;
        });
    }
    static getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield categoriesRepository_1.CategoryRepository.getAllCategories();
            return categories;
        });
    }
    static getCategoryById(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield categoriesRepository_1.CategoryRepository.getCategoryById(categoryId);
            if (!category) {
                throw new Error(`Category with ID ${categoryId} not found`);
            }
            return category;
        });
    }
    static createCategory(name, pageId, parentTagId) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield categoriesRepository_1.CategoryRepository.createCategory(name, pageId, parentTagId);
            return category;
        });
    }
    static updateCategory(categoryId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield categoriesRepository_1.CategoryRepository.updateCategory(categoryId, name);
            return category;
        });
    }
    static updateCategoryWeight(categoryId, weight) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield categoriesRepository_1.CategoryRepository.updateCategoryWeight(categoryId, weight);
            return category;
        });
    }
    static deleteCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield categoriesRepository_1.CategoryRepository.deleteCategory(categoryId);
            return { message: `Category with ID ${categoryId} deleted successfully` };
        });
    }
}
exports.default = CategoryService;
