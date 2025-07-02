import { AdminMessageController } from "../controllers/AdminMessage";
import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const adminMessageRouter = Router();

// GET /admin-messages/global
adminMessageRouter.get("/global", authenticate, authorizeRoles(["Admin", "User"]), AdminMessageController.getGlobalMessages);

// GET /admin-messages/rating/:rating
adminMessageRouter.get("/rating/:rating", authenticate, authorizeRoles(["Admin", "User"]), AdminMessageController.getMessageByRating);

// GET /admin-messages/:id
adminMessageRouter.get("/:id", authenticate, authorizeRoles(["Admin", "User"]), AdminMessageController.getMessageById);

// POST /admin-messages
adminMessageRouter.post("/", authenticate, authorizeRoles(["Admin"]), AdminMessageController.createMessage);

// PUT /admin-messages/:id
adminMessageRouter.put("/:id", authenticate, authorizeRoles(["Admin"]), AdminMessageController.updateMessage);

// DELETE /admin-messages/:id
adminMessageRouter.delete("/:id", authenticate, authorizeRoles(["Admin"]), AdminMessageController.deleteMessage);

export default adminMessageRouter;