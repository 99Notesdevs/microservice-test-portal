"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Calendar_1 = require("../controllers/Calendar");
const authenticate_1 = require("../middlewares/authenticate");
const authorizeRoles_1 = require("../middlewares/authorizeRoles");
const calendarRouter = (0, express_1.Router)();
calendarRouter.post("/", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(["User"]), Calendar_1.CalendarController.createEvent);
calendarRouter.get("/user/:userId", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(["User"]), Calendar_1.CalendarController.getEventsByUser);
calendarRouter.get("/user/:userId/date", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(["User"]), Calendar_1.CalendarController.getEventsByDate); // expects ?date=1&month=6&year=2025
calendarRouter.put("/:id", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(["User"]), Calendar_1.CalendarController.updateEvent);
calendarRouter.delete("/:id", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(["User"]), Calendar_1.CalendarController.deleteEvent);
// Routes to get the tests
// Body: { month: number, year: number }
calendarRouter.get("/tests", authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(["User"]), Calendar_1.CalendarController.getTests);
exports.default = calendarRouter;
