import { Request, Response } from "express";
import { UserProgressService } from "../services/userProgressService";
import logger from "../utils/logger";

export class UserProgressController {
  // Get user progress for a specific user
  static async getUserProgress(req: Request, res: Response) {
    try {
        const userId = parseInt(req.params.userId);
        const progress = await UserProgressService.getUserProgress(userId);
        res.json({ success: true, data: progress });
    } catch (error: unknown) {
        logger.error("Error fetching user progress:", error);
        res.status(500).json({ success: false, error: "Failed to fetch user progress" });
    }
  }
}