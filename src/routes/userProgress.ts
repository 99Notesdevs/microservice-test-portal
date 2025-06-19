import { Router } from "express";
import { UserProgressController } from "../controllers/UserProgress";
import { authenticate } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const progressRouter = Router();

progressRouter.get("/:userId", authenticate, authorizeRoles(["User"]), UserProgressController.getUserProgress);

export default progressRouter;