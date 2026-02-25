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
exports.PremiumUserRepository = void 0;
const prisma_1 = require("../config/prisma");
const logger_1 = __importDefault(require("../utils/logger"));
class PremiumUserRepository {
    static getUserTests(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userTests = yield prisma_1.prisma.userTests.findMany({
                where: { userId },
            });
            logger_1.default.info(`Fetched tests for user ID ${userId}: ${JSON.stringify(userTests)}`);
            return userTests;
        });
    }
    static getUserTestSeries(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userTestSeries = yield prisma_1.prisma.userTestSeries.findMany({
                where: { userId },
                include: {
                    test: {
                        select: {
                            id: true,
                            name: true
                        },
                    },
                },
            });
            logger_1.default.info(`Fetched test series for user ID ${userId}: ${JSON.stringify(userTestSeries)}`);
            return userTestSeries;
        });
    }
    static getTestsByMonthAndYear(month, year, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tests = yield prisma_1.prisma.userTests.findMany({
                where: {
                    userId,
                    createdAt: {
                        gte: new Date(year, month - 1, 1),
                        lt: new Date(year, month, 1),
                    },
                },
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    result: true,
                    createdAt: true,
                }
            });
            logger_1.default.info(`Fetched tests for user ID ${userId} in month ${month} of year ${year}: ${JSON.stringify(tests)}`);
            return tests;
        });
    }
    static getTestSeriesByMonthAndYear(month, year, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const testSeries = yield prisma_1.prisma.userTestSeries.findMany({
                where: {
                    userId,
                    createdAt: {
                        gte: new Date(year, month - 1, 1),
                        lt: new Date(year, month, 1),
                    },
                },
                include: {
                    test: {
                        select: {
                            id: true,
                            name: true
                        },
                    },
                },
                orderBy: { createdAt: 'desc' }
            });
            logger_1.default.info(`Fetched test series for user ID ${userId} in month ${month} of year ${year}: ${JSON.stringify(testSeries)}`);
            return testSeries;
        });
    }
    static getUserTestSeriesScore(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userTestSeries = yield prisma_1.prisma.userTestSeries.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: {
                    testId: true,
                    score: true,
                },
            });
            logger_1.default.info(`Fetched user test series scores for user ID ${userId}: ${JSON.stringify(userTestSeries)}`);
            return userTestSeries;
        });
    }
    static getAverageScore(testId) {
        return __awaiter(this, void 0, void 0, function* () {
            const averageScore = yield prisma_1.prisma.userTestSeries.aggregate({
                _avg: {
                    score: true,
                },
                where: {
                    testId,
                },
            });
            logger_1.default.info(`Calculated average score for test ID ${testId}: ${JSON.stringify(averageScore)}`);
            return averageScore._avg.score || undefined;
        });
    }
    static getBestScore(testId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bestScore = yield prisma_1.prisma.userTestSeries.findFirst({
                where: { testId },
                orderBy: { score: 'desc' },
                select: {
                    score: true,
                },
            });
            logger_1.default.info(`Fetched best score for test ID ${testId}: ${JSON.stringify(bestScore)}`);
            return bestScore ? bestScore.score : undefined;
        });
    }
    static getUserTest(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userTest = yield prisma_1.prisma.userTests.findUnique({
                where: { id },
            });
            logger_1.default.info(`Fetched user test with ID ${id}: ${JSON.stringify(userTest)}`);
            return userTest;
        });
    }
    static getOneUserTestSeries(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userTestSeries = yield prisma_1.prisma.userTestSeries.findUnique({
                where: { id },
                include: {
                    test: {
                        select: {
                            id: true,
                            name: true
                        },
                    },
                },
            });
            logger_1.default.info(`Fetched user test series with ID ${id}: ${JSON.stringify(userTestSeries)}`);
            return userTestSeries;
        });
    }
    static storeUserTest(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const userTest = yield prisma_1.prisma.userTests.create({
                data: {
                    userId: data.userId,
                    questionIds: data.questionIds,
                    response: JSON.stringify(data),
                    result: JSON.stringify(data),
                },
            });
            logger_1.default.info(`Stored user test: ${JSON.stringify(userTest)}`);
            return userTest;
        });
    }
    static storeUserTestSeries(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const userTestSeries = yield prisma_1.prisma.userTestSeries.create({
                data: {
                    userId: data.userId,
                    response: JSON.stringify(data),
                    score: data.score,
                    result: JSON.stringify(data),
                    testId: data.testId,
                },
            });
            logger_1.default.info(`Stored user test series: ${JSON.stringify(userTestSeries)}`);
            return userTestSeries;
        });
    }
    static updateUserTest(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUserTest = yield prisma_1.prisma.userTests.update({
                where: { id },
                data: {
                    questionIds: data.questionIds,
                    response: JSON.stringify(data),
                    result: JSON.stringify(data),
                },
            });
            logger_1.default.info(`Updated user test with ID ${id}: ${JSON.stringify(updatedUserTest)}`);
            return updatedUserTest;
        });
    }
    static updateUserTestSeries(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUserTestSeries = yield prisma_1.prisma.userTestSeries.update({
                where: { id },
                data: {
                    testId: data.testId,
                    response: JSON.stringify(data),
                    result: JSON.stringify(data),
                },
            });
            logger_1.default.info(`Updated user test series with ID ${id}: ${JSON.stringify(updatedUserTestSeries)}`);
            return updatedUserTestSeries;
        });
    }
}
exports.PremiumUserRepository = PremiumUserRepository;
