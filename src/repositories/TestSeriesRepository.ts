import { prisma } from "../config/prisma";
import { ITestSeries } from "../interfaces/testSeries.interface";
import logger from "../utils/logger";
import redis from "../config/RedisClient";

export class TestSeriesRepository {
    private static cacheTTL = 60 * 60;

    static async getAllTestSeries() {
        logger.info("Fetching all test series");
        const cacheKey = "allTestSeries";
        const cachedTestSeries = await redis.get(cacheKey);
        if (cachedTestSeries) {
            logger.info("Returning cached test series");
            return JSON.parse(cachedTestSeries);
        }

        const testSeries = await prisma.testSeries.findMany({
            include: {
                questions: true
            }
        });
        
        if (testSeries.length === 0) {
            logger.warn("No test series found");
            throw new Error("No test series found");
        }
        await redis.setex(cacheKey, this.cacheTTL, JSON.stringify(testSeries));
        
        logger.info(`Fetched all test series: ${JSON.stringify(testSeries)}`);
        return testSeries;
    }

    static async getTestSeriesById(id: number) {
        logger.info(`Fetching test series by ID: ${id}`);
        const cacheKey = `testSeries:${id}`;
        const cachedTestSeries = await redis.get(cacheKey);
        if (cachedTestSeries) {
            logger.info(`Returning cached test series for ID: ${id}`);
            return JSON.parse(cachedTestSeries);
        }

        const testSeries = await prisma.testSeries.findUnique({
            where: { id },
            include: {
                questions: true
            }
        });
        
        if (!testSeries) {
            logger.warn(`Test series with ID ${id} not found`);
            throw new Error(`Test series with ID ${id} not found`);
        }
        await redis.setex(cacheKey, this.cacheTTL, JSON.stringify(testSeries));

        logger.info(`Fetched test series by ID ${id}: ${JSON.stringify(testSeries)}`);
        return testSeries;
    }

    static async createTestSeries(data: ITestSeries) {
        logger.info(`Creating test series with data: ${typeof data.questionIds}`);
        const testSeries = await prisma.testSeries.create({
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
        logger.info(`Created test series: ${JSON.stringify(testSeries)}`);
        return testSeries;
    }

    static async updateTestSeries(id: number, data: Partial<ITestSeries>) {
        const testSeries = await prisma.testSeries.update({
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
                    set: (data.questionIds ?? []).map((questionId) => ({
                        id: Number(questionId),
                    })),
                }
            },
        });
        logger.info(`Updated test series: ${JSON.stringify(testSeries)}`);
        return testSeries;
    }

    static async deleteTestSeries(id: number) {
        const testSeries = await prisma.testSeries.delete({
            where: { id },
        });
        logger.info(`Deleted test series: ${JSON.stringify(testSeries)}`);
        return testSeries;
    }
}