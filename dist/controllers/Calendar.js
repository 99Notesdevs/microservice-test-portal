"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarController = void 0;
const CalendarService_1 = require("../services/CalendarService");
class CalendarController {
    static createEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = yield CalendarService_1.CalendarService.createEvent(req.body);
                res.status(201).json({ success: true, data: event });
            }
            catch (error) {
                res.status(500).json({ success: false, message: "Failed to create event", error });
            }
        });
    }
    static getTests(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const month = parseInt(req.query.month);
                const year = parseInt(req.query.year);
                const uid = req.authUser;
                if (!uid) {
                    throw new Error("Unauthorized: User ID is required");
                }
                if (!month || !year || typeof month !== 'number' || typeof year !== 'number') {
                    throw new Error("Invalid request body. Expected { month: number, year: number }");
                }
                const tests = yield CalendarService_1.CalendarService.getTests(month, year, parseInt(uid));
                res.status(200).json({ success: true, data: tests });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error instanceof Error ? error.message : "An unknown error occurred" });
            }
        });
    }
    static getEventsByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = Number(req.params.userId);
                const events = yield CalendarService_1.CalendarService.getEventsByUser(userId);
                res.status(200).json({ success: true, data: events });
            }
            catch (error) {
                res.status(500).json({ success: false, message: "Failed to fetch events", error });
            }
        });
    }
    static getEventsByDate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = Number(req.params.userId);
                const date = Number(req.query.date);
                const month = Number(req.query.month);
                const year = Number(req.query.year);
                const events = yield CalendarService_1.CalendarService.getEventsByDate(userId, date, month, year);
                res.status(200).json({ success: true, data: events });
            }
            catch (error) {
                res.status(500).json({ success: false, message: "Failed to fetch events by date", error });
            }
        });
    }
    static updateEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const updateData = {
                    event: req.body.event,
                    status: req.body.status
                };
                const event = yield CalendarService_1.CalendarService.updateEvent(id, updateData);
                res.status(200).json({ success: true, data: event });
            }
            catch (error) {
                res.status(500).json({ success: false, message: "Failed to update event", error });
            }
        });
    }
    static deleteEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                yield CalendarService_1.CalendarService.deleteEvent(id);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ success: false, message: "Failed to delete event", error });
            }
        });
    }
}
exports.CalendarController = CalendarController;
