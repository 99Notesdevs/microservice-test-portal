import { Request, Response } from "express";
import { CalendarService } from "../services/CalendarService";

export class CalendarController {
  static async createEvent(req: Request, res: Response) {
    try {
      const event = await CalendarService.createEvent(req.body);
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to create event", error });
    }
  }

  static async getTests(req: Request, res: Response) {
    try {
      const params = req.params;
      const uid = req.body.authUser;
      if(!uid) {
        throw new Error("Unauthorized: User ID is required");
      }
      if (!params || typeof params.month !== 'number' || typeof params.year !== 'number') {
        throw new Error("Invalid request body. Expected { month: number, year: number }");
      }
      const month = params.month;
      const year = params.year;
      const tests = await CalendarService.getTests(month, year, parseInt(uid));
      res.status(200).json({ success: true, data: tests });
    } catch(error: unknown) {
      res.status(500).json({ success: false, message: error instanceof Error ? error.message : "An unknown error occurred" });
    }
  }

  static async getEventsByUser(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const events = await CalendarService.getEventsByUser(userId);
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events", error });
    }
  }

  static async getEventsByDate(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const date = Number(req.query.date);
      const month = Number(req.query.month);
      const year = Number(req.query.year);
      const events = await CalendarService.getEventsByDate(userId, date, month, year);
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events by date", error });
    }
  }

  static async updateEvent(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const event = await CalendarService.updateEvent(id, req.body);
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to update event", error });
    }
  }

  static async deleteEvent(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await CalendarService.deleteEvent(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete event", error });
    }
  }
}