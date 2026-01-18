"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserProgress_1 = require("../controllers/UserProgress");
const authenticate_1 = require("../middlewares/authenticate");
const authorizeRoles_1 = require("../middlewares/authorizeRoles");
const progressRouter = (0, express_1.Router)();
progressRouter.get("/:userId", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(["User"]), UserProgress_1.UserProgressController.getUserProgress);
exports.default = progressRouter;
