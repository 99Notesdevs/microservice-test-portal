import { TestService } from "../services/testService";
import { Request, Response } from "express";

export class TestController {
  static async getAllTests(req: Request, res: Response) {
    try {
      const tests = await TestService.getAllTests();
      res.status(200).json({ success: true, data: tests });
    } catch (error: unknown) {
      res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
    }
  }

  static async getTestById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const test = await TestService.getTestById(id);
      res.status(200).json({ success: true, data: test });
    } catch (error: unknown) {
      res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
    }
  }

    static async createTest(req: Request, res: Response) {
        try {
        const data = req.body;
        const newTest = await TestService.createTest(data);
        res.status(201).json({ success: true, data: newTest });
        } catch (error: unknown) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
        }
    }

    static async updateTest(req: Request, res: Response) {
        try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const updatedTest = await TestService.updateTest(id, data);
        res.status(200).json({ success: true, data: updatedTest });
        } catch (error: unknown) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
        }
    }

    static async deleteTest(req: Request, res: Response) {
        try {
        const id = parseInt(req.params.id);
        await TestService.deleteTest(id);
        res.status(204).send();
        } catch (error: unknown) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
        }
    }
}