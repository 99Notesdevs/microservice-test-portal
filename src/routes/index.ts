import { Router } from "express";
import questionRouter from "./questions";

const router = Router();

router.get("/healthCheck", (req, res) => {
    
    res.status(200).json({
        message: "Welcome to test portal micorservice",
        status: 200,
    });
});

router.use('/questions', questionRouter);

export default router;