import { Router } from "express";
import questionRouter from "./questions";
import categoryRouter from "./categories";
import testSeriesRouter from "./testSeries";
import testRouter from "./test";
import premiumUserRouter from "./premiumUser";
import ratingCategoryRouter from "./ratingCategory";
import progressRouter from "./userProgress";
import progressConstraintsRouter from "./progressConstraints";
import calendarRouter from "./calendar";
import adminMessageRouter from "./adminMessage";

const router = Router();

router.get("/healthCheck", async (req, res) => {
    res.status(200).json({
        message: "Welcome to test portal micorservice",
        status: 200,
    });
});

router.use('/questions', questionRouter);
router.use('/categories', categoryRouter);
router.use('/testSeries', testSeriesRouter);
router.use('/test', testRouter);
router.use('/user', premiumUserRouter);
router.use('/ratingCategory', ratingCategoryRouter);
router.use('/progress', progressRouter);
router.use('/progressConstraints', progressConstraintsRouter);
router.use('/calendar', calendarRouter);
router.use('admin-messages', adminMessageRouter);

export default router;