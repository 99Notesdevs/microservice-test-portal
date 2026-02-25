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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepository = void 0;
const prisma_1 = require("../config/prisma");
const logger_1 = __importDefault(require("../utils/logger"));
const RedisClient_1 = __importDefault(require("../config/RedisClient"));
class CategoryRepository {
    static getAllUniqueCategories(categoryIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!categoryIds || categoryIds.length === 0) {
                logger_1.default.warn("No category IDs provided for fetching unique categories");
                return [];
            }
            const cacheKey = `uniqueCategories:${categoryIds.join(",")}`;
            const cachedCategories = yield RedisClient_1.default.get(cacheKey);
            if (cachedCategories) {
                logger_1.default.info(`Returning cached unique categories for IDs: ${categoryIds}`);
                return JSON.parse(cachedCategories);
            }
            logger_1.default.info(`Fetching all categories for multiple selected Ids: ${categoryIds}`);
            const categories = yield prisma_1.prisma.$queryRawUnsafe(`
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
                yield RedisClient_1.default.setex(cacheKey, this.cacheTTL, JSON.stringify(categories));
            }
            else {
                logger_1.default.warn(`No categories found for IDs: ${categoryIds}`);
            }
            logger_1.default.info(`Fetched categories for multiple selected Ids: ${categoryIds}`);
            return categories;
        });
    }
    static getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info("Fetching all categories");
            const categories = yield prisma_1.prisma.categories.findMany();
            return categories;
        });
    }
    static getCategoryById(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Fetching category by ID: ${categoryId}`);
            const category = yield prisma_1.prisma.categories.findUnique({
                where: {
                    id: categoryId,
                }
            });
            if (!category) {
                logger_1.default.warn(`Category with ID ${categoryId} not found`);
                throw new Error(`Category with ID ${categoryId} not found`);
            }
            logger_1.default.info(`Fetched category by ID: ${categoryId}`);
            return category;
        });
    }
    static getCategoryByParentId(parentTagId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Fetching categories by parent ID: ${parentTagId}`);
            const categories = yield prisma_1.prisma.categories.findMany({
                where: {
                    parentTagId: parentTagId,
                },
                include: {
                    daughterTag: true,
                }
            });
            logger_1.default.info(`Fetched categories for parent ID: ${parentTagId}`);
            return categories;
        });
    }
    static getParentCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Fetching parent category for category ID: ${categoryId}`);
            const category = yield prisma_1.prisma.categories.findFirst({
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
            });
            logger_1.default.info(`Fetched parent category for category ID: ${categoryId}`);
            return category;
        });
    }
    static createCategory(name, pageId, parentTagId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Creating category with name: ${name}, pageId: ${pageId}, parentTagId: ${parentTagId}`);
            const category = yield prisma_1.prisma.categories.create({
                data: {
                    name,
                    parentTagId
                },
            });
            logger_1.default.info(`Created category with ID: ${category.id}`);
            return category;
        });
    }
    static updateCategory(categoryId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Updating category with ID: ${categoryId} to name: ${name}`);
            const category = yield prisma_1.prisma.categories.update({
                where: {
                    id: categoryId,
                },
                data: {
                    name,
                },
            });
            logger_1.default.info(`Updated category with ID: ${category.id}`);
            return category;
        });
    }
    static updateCategoryWeight(categoryId, weight) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.prisma.categories.update({
                where: {
                    id: categoryId,
                },
                data: {
                    weight,
                },
            });
        });
    }
    static deleteCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Deleting category with ID: ${categoryId}`);
            const category = yield prisma_1.prisma.categories.delete({
                where: {
                    id: categoryId,
                },
            });
            logger_1.default.info(`Deleted category with ID: ${categoryId}`);
            return category;
        });
    }
}
exports.CategoryRepository = CategoryRepository;
CategoryRepository.cacheTTL = 60 * 60;
