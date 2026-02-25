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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarRepository = void 0;
const prisma_1 = require("../config/prisma");
const logger_1 = __importDefault(require("../utils/logger"));
class CalendarRepository {
    static createEvent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            logger_1.default.info(`Creating event for user ${data.userId} on ${data.date}/${data.month}/${data.year}`);
            return yield prisma_1.prisma.userCalendar.create({
                data: {
                    userId: data.userId,
                    date: data.date,
                    month: data.month,
                    year: data.year,
                    status: (_a = data.status) !== null && _a !== void 0 ? _a : "pending",
                    event: data.event,
                },
            });
        });
    }
    static getEventsByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Fetching all events for user ${userId}`);
            return yield prisma_1.prisma.userCalendar.findMany({
                where: { userId },
                orderBy: [{ year: "desc" }, { month: "desc" }, { date: "desc" }],
            });
        });
    }
    static getEventsByDate(userId, date, month, year) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Fetching events for user ${userId} on ${date}/${month}/${year}`);
            return yield prisma_1.prisma.userCalendar.findMany({
                where: { userId, date, month, year },
            });
        });
    }
    static updateEvent(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Updating event with ID: ${id} with data:`, data);
            return yield prisma_1.prisma.userCalendar.update({
                where: { id },
                data,
            });
        });
    }
    static deleteEvent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Deleting event with ID: ${id}`);
            return yield prisma_1.prisma.userCalendar.delete({
                where: { id },
            });
        });
    }
}
exports.CalendarRepository = CalendarRepository;
