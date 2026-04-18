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
exports.CalendarService = void 0;
const CalendarRepository_1 = require("../repositories/CalendarRepository");
const PremiumUserRepository_1 = require("../repositories/PremiumUserRepository");
function mapCurrentAffairVisitToCalendarEvent(visit) {
    return {
        id: `ca-visit-${visit.id}`,
        userId: visit.userId,
        date: visit.date.getUTCDate(),
        month: visit.date.getUTCMonth() + 1,
        year: visit.date.getUTCFullYear(),
        status: "completed",
        event: "Current Affairs Visit",
        type: "currentAffairVisit",
        readOnly: true,
        createdAt: visit.createdAt,
        updatedAt: visit.createdAt,
    };
}
function sortEventsByDateDesc(a, b) {
    if (a.year !== b.year)
        return b.year - a.year;
    if (a.month !== b.month)
        return b.month - a.month;
    return b.date - a.date;
}
class CalendarService {
    static createEvent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CalendarRepository_1.CalendarRepository.createEvent(data);
        });
    }
    static getTests(month, year, uid) {
        return __awaiter(this, void 0, void 0, function* () {
            const tests = yield PremiumUserRepository_1.PremiumUserRepository.getTestsByMonthAndYear(month, year, uid);
            const testSeries = yield PremiumUserRepository_1.PremiumUserRepository.getTestSeriesByMonthAndYear(month, year, uid);
            return { tests, testSeries };
        });
    }
    static getEventsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [events, currentAffairVisits] = yield Promise.all([
                CalendarRepository_1.CalendarRepository.getEventsByUser(userId),
                CalendarRepository_1.CalendarRepository.getCurrentAffairVisitsByUser(userId),
            ]);
            const visitEvents = currentAffairVisits.map(mapCurrentAffairVisitToCalendarEvent);
            return [...events, ...visitEvents].sort(sortEventsByDateDesc);
        });
    }
    static getEventsByDate(userId, date, month, year) {
        return __awaiter(this, void 0, void 0, function* () {
            const [events, currentAffairVisits] = yield Promise.all([
                CalendarRepository_1.CalendarRepository.getEventsByDate(userId, date, month, year),
                CalendarRepository_1.CalendarRepository.getCurrentAffairVisitsByDate(userId, date, month, year),
            ]);
            const visitEvents = currentAffairVisits.map(mapCurrentAffairVisitToCalendarEvent);
            return [...events, ...visitEvents].sort(sortEventsByDateDesc);
        });
    }
    static updateEvent(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CalendarRepository_1.CalendarRepository.updateEvent(id, data);
        });
    }
    static deleteEvent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CalendarRepository_1.CalendarRepository.deleteEvent(id);
        });
    }
}
exports.CalendarService = CalendarService;
