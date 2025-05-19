import { PremiumUserService } from "../services/premiumUserService";
import { Request, Response } from "express";

export class PremiumUserController {
  static async getUserTests(req: Request, res: Response) {
    try {
      const userId = parseInt(req.body.authUser);
      const userTests = await PremiumUserService.getUserTests(userId);
      res.status(200).json({ success: true, data: userTests });
    } catch (error: unknown) {
      res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
    }
  }

  static async getUserTestSeries(req: Request, res: Response) {
    try {
      const userId = parseInt(req.body.authUser);
      const userTestSeries = await PremiumUserService.getUserTestSeries(userId);
      res.status(200).json({ success: true, data: userTestSeries });
    } catch (error: unknown) {
      res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
    }
  }

  static async getUserTest(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const userTest = await PremiumUserService.getUserTest(id);
      res.status(200).json({ success: true, data: userTest });
    } catch (error: unknown) {
      res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
    }
  }

  static async getOneUserTestSeries(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const userTestSeries = await PremiumUserService.getOneUserTestSeries(id);
      res.status(200).json({ success: true, data: userTestSeries });
    } catch (error: unknown) {
      res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
    }
  }

  static async storeUserTest(req: Request, res: Response) {
    try {
      const body = req.body;
      const data = {
        userId: parseInt(body.authUser),
        questionIds: body.questionIds as number[],
        response: JSON.stringify(body.response),
        result: JSON.stringify(body.result),
      };
      const newUserTest = await PremiumUserService.storeUserTest(data);
      res.status(201).json({ success: true, data: newUserTest });
    } catch (error: unknown) {
      res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
    }
  }

  static async storeUserTestSeries(req: Request, res: Response) {
    try {
      const body = req.body;
      const data = {
        userId: parseInt(body.authUser),
        testId: body.testId,
        response: JSON.stringify(body.response),
        result: JSON.stringify(body.result),
      }
      const newUserTestSeries = await PremiumUserService.storeUserTestSeries(data);
      res.status(201).json({ success: true, data: newUserTestSeries });
    } catch (error: unknown) {
      res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
    }
  }

  static async updateUserTest(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const body = req.body;
      const data = {
        questionIds: body.questionIds as number[],
        response: JSON.stringify(body.response),
        result: JSON.stringify(body.result),
      }
      const updatedUserTest = await PremiumUserService.updateUserTest(id, data);
      res.status(200).json({ success: true, data: updatedUserTest });
    } catch (error: unknown) {
      res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
    }
  }

  static async updateUserTestSeries(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const body = req.body;
      const data = {
        testId: body.testId,
        response: JSON.stringify(body.response),
        result: JSON.stringify(body.result),
      }
      const updatedUserTestSeries = await PremiumUserService.updateUserTestSeries(id, data);
      res.status(200).json({ success: true, data: updatedUserTestSeries });
    } catch (error: unknown) {
      res.status(500).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
    }
  }
}