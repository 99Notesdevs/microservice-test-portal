import { Request, Response } from "express";
import { ProgressConstraintsService } from "../services/progressConstraintService";

export class ProgressConstraintController {
  static async getProgressConstraintsById(req: Request, res: Response) {
    const progressConstraints = await ProgressConstraintsService.getProgressConstraintsById(1);
    if (!progressConstraints) {
      res.status(404).json({ success: false, error: "Progress constraints not found" });
    }
    res.status(200).json({ success: true, data: progressConstraints });
  }

  static async createProgressConstraints(req: Request, res: Response) {
    const { weakLimit, strongLimit, xp_status } = req.body;
    if (typeof weakLimit !== 'number' || typeof strongLimit !== 'number' || typeof xp_status !== 'string') {
      res.status(400).json({ success: false, error: "Invalid input data" });
    }
    const newProgressConstraints = await ProgressConstraintsService.createProgressConstraints({
      weakLimit,
      strongLimit,
      xp_status
    });
    res.status(201).json({ success: true, data: newProgressConstraints });
  }
}