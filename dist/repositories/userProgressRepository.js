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
exports.UserProgressRepository = void 0;
const prisma_1 = require("../config/prisma");
const logger_1 = __importDefault(require("../utils/logger"));
class UserProgressRepository {
    static getUserProgress(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Fetching user progress for user ${userId}`);
            const userProgress = yield prisma_1.prisma.userProgress.findMany({
                where: { userId },
                orderBy: { date: 'desc' },
                take: 30,
            });
            return userProgress;
        });
    }
    static getUserProgressByDate(userId, date) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Fetching user progress for user ${userId} on date ${date}`);
            const progress = yield prisma_1.prisma.userProgress.findUnique({
                where: {
                    userId_date: {
                        userId,
                        date: new Date(date.setHours(0, 0, 0, 0)),
                    },
                },
            });
            return progress;
        });
    }
    static updateUserProgress(userId, progressMin, progressMax) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Updating user progress for user ${userId} with min: ${progressMin}, max: ${progressMax}`);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const updatedProgress = yield prisma_1.prisma.userProgress.upsert({
                where: { userId_date: { userId, date: today } },
                update: { progressMin, progressMax },
                create: { userId, progressMin, progressMax, date: today },
            });
            return updatedProgress;
        });
    }
}
exports.UserProgressRepository = UserProgressRepository;
