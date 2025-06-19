import { Router } from "express";
import { CalendarController } from "../controllers/Calendar";

const calendarRouter = Router();

calendarRouter.post("/", CalendarController.createEvent);
calendarRouter.get("/user/:userId", CalendarController.getEventsByUser);
calendarRouter.get("/user/:userId/date", CalendarController.getEventsByDate); // expects ?date=1&month=6&year=2025
calendarRouter.put("/:id", CalendarController.updateEvent);
calendarRouter.delete("/:id", CalendarController.deleteEvent);

export default calendarRouter;