"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Categories_1 = __importDefault(require("../controllers/Categories"));
const authenticate_1 = require("../middlewares/authenticate");
const authorizeRoles_1 = require("../middlewares/authorizeRoles");
const categoryRouter = (0, express_1.Router)();
categoryRouter.get('/', authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(["Admin", "User"]), Categories_1.default.getAllCategories);
// Params: /:id
categoryRouter.get('/:id', authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(["Admin", "User"]), Categories_1.default.getCategoryById);
// Body: { name: string, parentTagId: number }
categoryRouter.post('/', authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(["Admin"]), Categories_1.default.createCategory);
// Params: /:id
// Body: { name: string }
categoryRouter.put('/:id', authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(["Admin"]), Categories_1.default.updateCategory);
// Params: /:id
// Body: { weight: Decimal }
categoryRouter.put('/:id/weight', authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(["Admin"]), Categories_1.default.updateCategoryWeight);
// Params: /:id
categoryRouter.delete('/:id', authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(["Admin"]), Categories_1.default.deleteCategory);
exports.default = categoryRouter;
