import { ProgressConstraintController } from "../controllers/ProgressContraint";
import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const progressConstraintsRouter = Router();

progressConstraintsRouter.get("/", ProgressConstraintController.getProgressConstraintsById);

progressConstraintsRouter.post("/", authenticate, authorizeRoles(["Admin"]), ProgressConstraintController.createProgressConstraints);

progressConstraintsRouter.put("/:id", authenticate, authorizeRoles(["Admin"]), ProgressConstraintController.updateProgressConstraints);

export default progressConstraintsRouter;