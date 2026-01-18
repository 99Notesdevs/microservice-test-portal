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
const categoryService_1 = __importDefault(require("../services/categoryService"));
const library_1 = require("@prisma/client/runtime/library");
class CategoriesController {
    static getCategoriesByIds(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryIds } = req.body;
                if (!categoryIds || !Array.isArray(categoryIds)) {
                    throw new Error('Category IDs must be provided as an array');
                }
                const categories = yield categoryService_1.default.getCategoriesByIds(categoryIds);
                res.status(200).json({ success: true, data: categories });
            }
            catch (error) {
                res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
            }
        });
    }
    static getAllCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield categoryService_1.default.getAllCategories();
                res.status(200).json({ success: true, data: categories });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
            }
        });
    }
    static getCategoryById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    throw new Error('Category ID is required');
                }
                const category = yield categoryService_1.default.getCategoryById(Number(id));
                res.status(200).json({ success: true, data: category });
            }
            catch (error) {
                res.status(404).json({ success: false, message: error instanceof Error ? error.message : 'Category not found' });
            }
        });
    }
    static createCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, pageId, parentTagId } = req.body;
                if (!name) {
                    throw new Error('Category name is required');
                }
                const category = yield categoryService_1.default.createCategory(name, pageId, parentTagId);
                res.status(201).json({ success: true, data: category });
            }
            catch (error) {
                res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
            }
        });
    }
    static updateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { name } = req.body;
                if (!id || !name) {
                    throw new Error('Category ID and name are required');
                }
                const category = yield categoryService_1.default.updateCategory(Number(id), name);
                res.status(200).json({ success: true, data: category });
            }
            catch (error) {
                res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
            }
        });
    }
    static updateCategoryWeight(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { weight } = req.body;
                if (!id || weight === undefined) {
                    throw new Error('Category ID and weight are required');
                }
                const category = yield categoryService_1.default.updateCategoryWeight(Number(id), new library_1.Decimal(weight));
                res.status(200).json({ success: true, data: category });
            }
            catch (error) {
                res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
            }
        });
    }
    static deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    throw new Error('Category ID is required');
                }
                const result = yield categoryService_1.default.deleteCategory(Number(id));
                res.status(200).json({ success: true, message: result.message });
            }
            catch (error) {
                res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
            }
        });
    }
}
exports.default = CategoriesController;
