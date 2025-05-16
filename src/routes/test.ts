import { Router } from "express";
import { TestController } from "../controllers/Test";

const testRouter = Router();

testRouter.get("/", TestController.getAllTests);

testRouter.get("/:id", TestController.getTestById);

testRouter.post("/", TestController.createTest);

testRouter.put("/:id", TestController.updateTest);

testRouter.delete("/:id", TestController.deleteTest);

export default testRouter;