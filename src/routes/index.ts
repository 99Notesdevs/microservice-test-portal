import { Router } from "express";

const router = Router();

router.get("/healthCheck", (req, res) => {
    
    res.status(200).json({
        message: "Welcome to test portal micorservice",
        status: 200,
    });
});

export default router;