import { Router } from "express";
import { TestController } from "../controllers/Test";
import { authenticate } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const testRouter = Router();

testRouter.get("/", authenticate, authorizeRoles(["Admin", "User"]), TestController.getAllTests);

testRouter.get("/:id", authenticate, authorizeRoles(["Admin", "User"]), TestController.getTestById);

testRouter.post("/", authenticate, authorizeRoles(["Admin"]), TestController.createTest);

testRouter.put("/:id", authenticate, authorizeRoles(["Admin"]), TestController.updateTest);

testRouter.delete("/:id", authenticate, authorizeRoles(["Admin"]), TestController.deleteTest);

export default testRouter;