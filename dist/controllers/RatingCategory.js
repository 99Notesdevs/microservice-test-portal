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
exports.RatingCategoryController = void 0;
const ratingCategoryService_1 = require("../services/ratingCategoryService");
class RatingCategoryController {
    static getRating(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, categoryId } = req.params;
                const rating = yield ratingCategoryService_1.RatingCategoryService.getRating(parseInt(userId), parseInt(categoryId));
                res.status(200).json({ success: true, data: rating });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
            }
        });
    }
    static getRatingCategoryByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const categories = yield ratingCategoryService_1.RatingCategoryService.getRatingCategoryByUserId(parseInt(userId));
                res.status(200).json({ success: true, data: categories });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
            }
        });
    }
    static getRatingCategoryByCategoryId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.params;
                const category = yield ratingCategoryService_1.RatingCategoryService.getRatingCategoryByCategoryId(parseInt(categoryId));
                res.status(200).json({ success: true, data: category });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
            }
        });
    }
    static updateRatingCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, categoryId } = req.params;
                const { rating } = req.body;
                const updatedCategory = yield ratingCategoryService_1.RatingCategoryService.updateRatingCategory(parseInt(userId), parseInt(categoryId), rating);
                res.status(200).json({ success: true, data: updatedCategory });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
            }
        });
    }
    static deleteRatingCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, categoryId } = req.params;
                yield ratingCategoryService_1.RatingCategoryService.deleteRatingCategory(parseInt(userId), parseInt(categoryId));
                res.sendStatus(204);
            }
            catch (error) {
                res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
            }
        });
    }
}
exports.RatingCategoryController = RatingCategoryController;
