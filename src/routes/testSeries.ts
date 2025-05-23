import { Router } from "express";
import { TestSeriesController } from "../controllers/TestSeries";
import { authenticate } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const testSeriesRouter = Router();

testSeriesRouter.get("/", authenticate, authorizeRoles(["Admin", "User"]), TestSeriesController.getAllTestSeries);

testSeriesRouter.get("/:id", authenticate, authorizeRoles(["Admin", "User"]), TestSeriesController.getTestSeriesById);

testSeriesRouter.post("/", authenticate, authorizeRoles(["Admin"]), TestSeriesController.createTestSeries);

testSeriesRouter.put("/:id", authenticate, authorizeRoles(["Admin"]), TestSeriesController.updateTestSeries);

testSeriesRouter.delete("/:id", authenticate, authorizeRoles(["Admin"]), TestSeriesController.deleteTestSeries);

export default testSeriesRouter;