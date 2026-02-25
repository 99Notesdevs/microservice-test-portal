"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdminMessage_1 = require("../controllers/AdminMessage");
const express_1 = require("express");
const authenticate_1 = require("../middlewares/authenticate");
const authorizeRoles_1 = require("../middlewares/authorizeRoles");
const adminMessageRouter = (0, express_1.Router)();
// GET /admin-messages/global
adminMessageRouter.get("/global", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(["Admin", "User"]), AdminMessage_1.AdminMessageController.getGlobalMessages);
// GET /admin-messages/rating/:rating
adminMessageRouter.get("/rating/:rating", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(["Admin", "User"]), AdminMessage_1.AdminMessageController.getMessageByRating);
// GET /admin-messages/:id
adminMessageRouter.get("/:id", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(["Admin", "User"]), AdminMessage_1.AdminMessageController.getMessageById);
// POST /admin-messages
adminMessageRouter.post("/", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(["Admin"]), AdminMessage_1.AdminMessageController.createMessage);
// PUT /admin-messages/:id
adminMessageRouter.put("/:id", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(["Admin"]), AdminMessage_1.AdminMessageController.updateMessage);
// DELETE /admin-messages/:id
adminMessageRouter.delete("/:id", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(["Admin"]), AdminMessage_1.AdminMessageController.deleteMessage);
exports.default = adminMessageRouter;
