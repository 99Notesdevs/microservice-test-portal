import { Router } from "express";
import { CalendarController } from "../controllers/Calendar";
import { authenticate } from "../middlewares/authenticate";
import { authorizeRoles } from "../middlewares/authorizeRoles";

const calendarRouter = Router();

calendarRouter.post("/", authenticate, authorizeRoles(["User"]), CalendarController.createEvent);
calendarRouter.get("/user/:userId", authenticate, authorizeRoles(["User"]), CalendarController.getEventsByUser);
calendarRouter.get("/user/:userId/date", authenticate, authorizeRoles(["User"]), CalendarController.getEventsByDate); // expects ?date=1&month=6&year=2025
calendarRouter.put("/:id", authenticate, authorizeRoles(["User"]), CalendarController.updateEvent);
calendarRouter.delete("/:id", authenticate, authorizeRoles(["User"]), CalendarController.deleteEvent);

// Routes to get the tests
// Body: { month: number, year: number }
calendarRouter.get("/tests", authenticate, authorizeRoles(["User"]), CalendarController.getTests);

export default calendarRouter;