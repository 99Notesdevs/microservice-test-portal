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
exports.attemptQuestionService = attemptQuestionService;
const categoriesRepository_1 = require("../repositories/categoriesRepository");
const ratingCategoryRepository_1 = require("../repositories/ratingCategoryRepository");
const logger_1 = __importDefault(require("../utils/logger"));
function getLeafCategories(categoryId) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info("getLeafCategories called with categoryId:", categoryId);
        // Find all the children of the given category
        const queue = [yield categoriesRepository_1.CategoryRepository.getCategoryById(categoryId)];
        const leaves = [];
        while (queue.length > 0) {
            const node = queue.shift();
            if (!node)
                continue;
            // Find if the node is a parent to a category / it has children
            const children = yield categoriesRepository_1.CategoryRepository.getCategoryByParentId(node.id);
            if (children.length === 0) {
                leaves.push(node);
            }
            else {
                queue.push(...children);
            }
        }
        logger_1.default.info("Leaf categories found:", leaves.map(l => l.id));
        return leaves;
    });
}
function calculateElo(currentRating, questionRating, score) {
    logger_1.default.info("calculateElo called with", { currentRating, questionRating, score });
    const Ps = 1.0 / (1 + Math.pow(10, (currentRating - questionRating) / 400));
    const result = (currentRating + 8 * (score - Ps));
    return result;
}
function updateElo(userId, categoryId, correct, questionRating) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        logger_1.default.info("updateElo called with", { userId, categoryId, correct, questionRating });
        // Find existing user rating for the category
        const existing = yield ratingCategoryRepository_1.RatingCategoryRepository.getRating(userId, categoryId);
        const currentRating = (_a = existing === null || existing === void 0 ? void 0 : existing.rating) !== null && _a !== void 0 ? _a : 250;
        // Find the question rating and then calculate elo
        const score = correct === 1 ? 1 : correct === -1 ? 0 : 0.1; // 1 for correct, 0 for incorrect, 0.1 for unattempted
        const newRating = calculateElo(currentRating, questionRating, score);
        yield ratingCategoryRepository_1.RatingCategoryRepository.updateRatingCategory(userId, categoryId, newRating);
        return newRating;
    });
}
function propagateRatingUpwards(categoryId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info("propagateRatingUpwards called with", { categoryId, userId });
        let currentId = categoryId;
        while (true) {
            // Find the parent of the current category
            const parent = yield categoriesRepository_1.CategoryRepository.getParentCategory(currentId);
            if (!parent)
                break;
            const childrenRatings = yield Promise.all(parent.daughterTag.map((c) => __awaiter(this, void 0, void 0, function* () { var _a; return ((_a = (yield ratingCategoryRepository_1.RatingCategoryRepository.getRating(userId, c.id))) === null || _a === void 0 ? void 0 : _a.rating) || 250; })));
            const avgRating = childrenRatings.reduce((a, b) => a + b, 0) / childrenRatings.length;
            yield ratingCategoryRepository_1.RatingCategoryRepository.updateRatingCategory(userId, parent.id, avgRating);
            currentId = parent.id;
        }
        return currentId;
    });
}
function getWeightedRating(userId, categoryId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        logger_1.default.info("getWeightedRating called with", { userId, categoryId });
        const daughterCategories = (yield categoriesRepository_1.CategoryRepository.getCategoryByParentId(categoryId)) || [];
        const ratings = yield Promise.all(daughterCategories.map((c) => __awaiter(this, void 0, void 0, function* () { return (yield ratingCategoryRepository_1.RatingCategoryRepository.getRating(userId, c.id)) || { id: c.id, rating: 250 }; })));
        let total = ((_a = (yield ratingCategoryRepository_1.RatingCategoryRepository.getRating(userId, categoryId))) === null || _a === void 0 ? void 0 : _a.rating) || 250;
        for (const rating of ratings) {
            const categoryWeight = yield categoriesRepository_1.CategoryRepository.getCategoryById(rating.id);
            total += Number((categoryWeight === null || categoryWeight === void 0 ? void 0 : categoryWeight.weight) || 0.2) * Number(rating.rating);
        }
        return Math.round(total);
    });
}
function attemptQuestionService(userId, categoryId, isCorrect, questionRating) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info("attemptQuestionService called with", { userId, categoryId, isCorrect, questionRating });
        const targetCategories = yield getLeafCategories(categoryId);
        let parent = 0;
        for (const leaf of targetCategories) {
            updateElo(userId, leaf.id, isCorrect, questionRating);
        }
        for (const leaf of targetCategories) {
            parent = yield propagateRatingUpwards(leaf.id, userId);
        }
        const globalRating = yield getWeightedRating(userId, parent);
        return globalRating;
    });
}
