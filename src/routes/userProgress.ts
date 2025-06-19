import { Router } from "express";
import { UserProgressController } from "../controllers/UserProgress";

const progressRouter = Router();

progressRouter.get("/:userId", UserProgressController.getUserProgress);

export default progressRouter;