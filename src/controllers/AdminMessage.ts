import { Request, Response } from "express";
import { AdminMessageService } from "../services/AdminMessageService";

export class AdminMessageController {
  static async getGlobalMessages(req: Request, res: Response) {
    const skip = Number(req.query.skip) || 0;
    const take = Number(req.query.take) || 10;
    try {
      const messages = await AdminMessageService.getGlobalMessages(skip, take);
      res.status(200).json({ success: true, data: messages });
    } catch (error: unknown) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  }

  static async getMessageByRating(req: Request, res: Response) {
    const rating = Number(req.params.rating);
    const skip = Number(req.query.skip) || 0;
    const take = Number(req.query.take) || 10;
    try {
      const messages = await AdminMessageService.getMessageByRating(
        rating,
        skip,
        take
      );
      res.status(200).json({ success: true, data: messages });
    } catch (error: unknown) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  }

  static async getMessageById(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      const message = await AdminMessageService.getMessageById(id);
      if (!message) {
        throw new Error("Message not found");
      }
      res.json({ success: true, data: message });
    } catch (error: unknown) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  }

  static async createMessage(req: Request, res: Response) {
    try {
      const data = {
        type: req.body.type,
        content: req.body.content,
        ratingS: req.body.ratingS,
        ratingE: req.body.ratingE,
      };
      if (!data.type || !data.content) {
        throw new Error("Type and content are required");
      }
      if (data.ratingS && data.ratingE && data.ratingS > data.ratingE) {
        throw new Error("Invalid rating range: ratingS should be less than or equal to ratingE");
      }
      const message = await AdminMessageService.createMessage(data);
      res.status(201).json({ success: true, data: message });
    } catch (error: unknown) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  }

  static async updateMessage(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      const data = {
        type: req.body.type,
        content: req.body.content,
        ratingS: req.body.ratingS,
        ratingE: req.body.ratingE,
      };
      if (!data.type && !data.content && !data.ratingS && !data.ratingE) {
        throw new Error("At least one field (type, content, ratingS, ratingE) is required for update");
      }
      if (data.ratingS && data.ratingE && data.ratingS > data.ratingE)  {
        throw new Error("Invalid rating range: ratingS should be less than or equal to ratingE");
      }
      const message = await AdminMessageService.updateMessage(id, data);
      res.status(200).json({ success: true, data: message });
    } catch (error: unknown) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  }

  static async deleteMessage(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      const message = await AdminMessageService.deleteMessage(id);
      res.status(200).json({ success: true, data: message });
    } catch (error: unknown) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
  }
}
