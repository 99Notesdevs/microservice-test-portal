import { Router } from "express";
import questionRouter from "./questions";
import categoryRouter from "./categories";
import testSeriesRouter from "./testSeries";
import testRouter from "./test";
import premiumUserRouter from "./premiumUser";
import { getUserDetails } from "../grpc/client/client";

const router = Router();

router.get("/healthCheck", async (req, res) => {
    const response = await getUserDetails("1");
    console.log(response);
    res.status(200).json({
        message: "Welcome to test portal micorservice",
        status: 200,
    });
});

router.use('/questions', questionRouter);
router.use('/categories', categoryRouter);
router.use('/testSeries', testSeriesRouter);
router.use('/test', testRouter);
router.use('/user', premiumUserRouter)

export default router;