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
exports.RatingCategoryRepository = void 0;
const prisma_1 = require("../config/prisma");
const logger_1 = __importDefault(require("../utils/logger"));
class RatingCategoryRepository {
    static getRating(userId, categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Fetching rating for user ${userId} and category ${categoryId}`);
            return yield prisma_1.prisma.categoryRating.findUnique({
                where: { userId_categoryId: { userId, categoryId } },
                select: { id: true, rating: true }
            });
        });
    }
    static getRatingCategoryByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Fetching rating categories for user ${userId}`);
            return yield prisma_1.prisma.categoryRating.findMany({
                where: { userId: userId },
                select: {
                    categoryId: true,
                    rating: true,
                },
            });
        });
    }
    static getRatingCategoryByCategoryId(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Fetching rating categories for category ${categoryId}`);
            return yield prisma_1.prisma.categoryRating.findMany({
                where: { categoryId: categoryId },
            });
        });
    }
    static updateRatingCategory(userId, categoryId, rating) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Updating rating for user ${userId} and category ${categoryId}`);
            return yield prisma_1.prisma.categoryRating.upsert({
                where: { userId_categoryId: { userId, categoryId } },
                update: { rating },
                create: { userId, categoryId, rating }
            });
        });
    }
    static deleteRatingCategory(userId, categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Deleting rating for user ${userId} and category ${categoryId}`);
            return yield prisma_1.prisma.categoryRating.delete({
                where: {
                    userId_categoryId: {
                        userId,
                        categoryId,
                    },
                },
            });
        });
    }
}
exports.RatingCategoryRepository = RatingCategoryRepository;
