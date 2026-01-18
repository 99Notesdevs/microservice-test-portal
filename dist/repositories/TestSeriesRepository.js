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
exports.TestSeriesRepository = void 0;
const prisma_1 = require("../config/prisma");
const logger_1 = __importDefault(require("../utils/logger"));
const RedisClient_1 = __importDefault(require("../config/RedisClient"));
class TestSeriesRepository {
    static getAllTestSeries() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info("Fetching all test series");
            const cacheKey = "allTestSeries";
            const cachedTestSeries = yield RedisClient_1.default.get(cacheKey);
            if (cachedTestSeries) {
                logger_1.default.info("Returning cached test series");
                return JSON.parse(cachedTestSeries);
            }
            const testSeries = yield prisma_1.prisma.testSeries.findMany({
                include: {
                    questions: true
                }
            });
            if (testSeries.length === 0) {
                logger_1.default.warn("No test series found");
                throw new Error("No test series found");
            }
            yield RedisClient_1.default.setex(cacheKey, this.cacheTTL, JSON.stringify(testSeries));
            logger_1.default.info(`Fetched all test series: ${JSON.stringify(testSeries)}`);
            return testSeries;
        });
    }
    static getTestSeriesById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Fetching test series by ID: ${id}`);
            const cacheKey = `testSeries:${id}`;
            const cachedTestSeries = yield RedisClient_1.default.get(cacheKey);
            if (cachedTestSeries) {
                logger_1.default.info(`Returning cached test series for ID: ${id}`);
                return JSON.parse(cachedTestSeries);
            }
            const testSeries = yield prisma_1.prisma.testSeries.findUnique({
                where: { id },
                include: {
                    questions: true
                }
            });
            if (!testSeries) {
                logger_1.default.warn(`Test series with ID ${id} not found`);
                throw new Error(`Test series with ID ${id} not found`);
            }
            yield RedisClient_1.default.setex(cacheKey, this.cacheTTL, JSON.stringify(testSeries));
            logger_1.default.info(`Fetched test series by ID ${id}: ${JSON.stringify(testSeries)}`);
            return testSeries;
        });
    }
    static createTestSeries(data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Creating test series with data: ${typeof data.questionIds}`);
            const testSeries = yield prisma_1.prisma.testSeries.create({
                data: {
                    name: data.name,
                    correctAttempted: data.correctAttempted,
                    wrongAttempted: data.wrongAttempted,
                    notAttempted: data.notAttempted,
                    partialAttempted: data.partialAttempted,
                    partialNotAttempted: data.partialNotAttempted,
                    partialWrongAttempted: data.partialWrongAttempted,
                    timeTaken: data.timeTaken,
                    questionsSingle: data.questionsSingle,
                    questionsMultiple: data.questionsMultiple,
                    questions: {
                        connect: data.questionIds.map((questionId) => ({
                            id: Number(questionId),
                        })),
                    }
                },
            });
            logger_1.default.info(`Created test series: ${JSON.stringify(testSeries)}`);
            return testSeries;
        });
    }
    static updateTestSeries(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const testSeries = yield prisma_1.prisma.testSeries.update({
                where: { id },
                data: {
                    name: data.name,
                    correctAttempted: data.correctAttempted,
                    wrongAttempted: data.wrongAttempted,
                    notAttempted: data.notAttempted,
                    partialAttempted: data.partialAttempted,
                    partialNotAttempted: data.partialNotAttempted,
                    partialWrongAttempted: data.partialWrongAttempted,
                    timeTaken: data.timeTaken,
                    questionsSingle: data.questionsSingle,
                    questionsMultiple: data.questionsMultiple,
                    questions: {
                        set: ((_a = data.questionIds) !== null && _a !== void 0 ? _a : []).map((questionId) => ({
                            id: Number(questionId),
                        })),
                    }
                },
            });
            logger_1.default.info(`Updated test series: ${JSON.stringify(testSeries)}`);
            return testSeries;
        });
    }
    static deleteTestSeries(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const testSeries = yield prisma_1.prisma.testSeries.delete({
                where: { id },
            });
            logger_1.default.info(`Deleted test series: ${JSON.stringify(testSeries)}`);
            return testSeries;
        });
    }
}
exports.TestSeriesRepository = TestSeriesRepository;
TestSeriesRepository.cacheTTL = 60 * 60;
