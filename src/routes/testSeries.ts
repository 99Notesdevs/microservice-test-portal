import { Router } from "express";
import { TestSeriesController } from "../controllers/TestSeries";

const testSeriesRouter = Router();

testSeriesRouter.get("/", TestSeriesController.getAllTestSeries);

testSeriesRouter.get("/:id", TestSeriesController.getTestSeriesById);

testSeriesRouter.post("/", TestSeriesController.createTestSeries);

testSeriesRouter.put("/:id", TestSeriesController.updateTestSeries);

testSeriesRouter.delete("/:id", TestSeriesController.deleteTestSeries);

export default testSeriesRouter;