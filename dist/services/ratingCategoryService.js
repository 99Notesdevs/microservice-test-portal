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
exports.RatingCategoryService = void 0;
const ratingCategoryRepository_1 = require("../repositories/ratingCategoryRepository");
class RatingCategoryService {
    static getRating(userId, categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ratingCategoryRepository_1.RatingCategoryRepository.getRating(userId, categoryId);
        });
    }
    static getRatingCategoryByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ratingCategoryRepository_1.RatingCategoryRepository.getRatingCategoryByUserId(userId);
        });
    }
    static getRatingCategoryByCategoryId(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ratingCategoryRepository_1.RatingCategoryRepository.getRatingCategoryByCategoryId(categoryId);
        });
    }
    static updateRatingCategory(userId, categoryId, rating) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ratingCategoryRepository_1.RatingCategoryRepository.updateRatingCategory(userId, categoryId, rating);
        });
    }
    static deleteRatingCategory(userId, categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ratingCategoryRepository_1.RatingCategoryRepository.deleteRatingCategory(userId, categoryId);
        });
    }
}
exports.RatingCategoryService = RatingCategoryService;
