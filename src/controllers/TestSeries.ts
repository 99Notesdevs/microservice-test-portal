import { TestSeriesService } from "../services/testSeriesService";
import { Request, Response } from "express";
import logger from "../utils/logger";

export class TestSeriesController {
  static async getAllTestSeries(req: Request, res: Response) {
    try {
      const testSeries = await TestSeriesService.getAllTestSeries();
      res.status(200).json({ success: true, data: testSeries });
    } catch (error: unknown) {
      res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
    }
  }

  static async getTestSeriesById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const testSeries = await TestSeriesService.getTestSeriesById(id);
      res.status(200).json({ success: true, data: testSeries });
    } catch (error: unknown) {
      res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
    }
  }

    static async createTestSeries(req: Request, res: Response) {
        try {
        const data = req.body;
        const newTestSeries = await TestSeriesService.createTestSeries(data);
        res.status(201).json({ success: true, data: newTestSeries });
        } catch (error: unknown) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
        }
    }

    static async updateTestSeries(req: Request, res: Response) {
        try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const updatedTestSeries = await TestSeriesService.updateTestSeries(id, data);
        res.status(200).json({ success: true, data: updatedTestSeries });
        } catch (error: unknown) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
        }
    }

    static async deleteTestSeries(req: Request, res: Response) {
        try {
        const id = parseInt(req.params.id);
        await TestSeriesService.deleteTestSeries(id);
        res.status(204).send();
        } catch (error: unknown) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
        }
    }
}