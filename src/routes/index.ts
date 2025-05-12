import { Router } from "express";
import questionRouter from "./questions";
import categoryRouter from "./categories";

const router = Router();

router.get("/healthCheck", (req, res) => {
    
    res.status(200).json({
        message: "Welcome to test portal micorservice",
        status: 200,
    });
});

router.use('/questions', questionRouter);
router.use('/categories', categoryRouter);

export default router;