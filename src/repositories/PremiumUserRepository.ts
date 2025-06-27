import { prisma } from "../config/prisma";
import {  IUserTest } from "../interfaces/tests.interface";
import { IUserTestSeries } from "../interfaces/testSeries.interface";
import logger from "../utils/logger";

export class PremiumUserRepository {
  // Get all tests for a specific user
  static async getUserTests(userId: number) {
    const userTests = await prisma.userTests.findMany({
      where: { userId },
    });
    logger.info(`Fetched tests for user ID ${userId}: ${JSON.stringify(userTests)}`);
    return userTests;
  }

  // Get all test series for a specific user
  static async getUserTestSeries(userId: number) {
    const userTestSeries = await prisma.userTestSeries.findMany({
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
    logger.info(`Fetched test series for user ID ${userId}: ${JSON.stringify(userTestSeries)}`);
    return userTestSeries;
  }

  static async getTestsByMonthAndYear(month: number, year: number, userId: number) {
    const tests = await prisma.userTests.findMany({
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
        result: true
      }
    });
    logger.info(`Fetched tests for user ID ${userId} in month ${month} of year ${year}: ${JSON.stringify(tests)}`);
    return tests;
  }

  static async getTestSeriesByMonthAndYear(month: number, year: number, userId: number) {
    const testSeries = await prisma.userTestSeries.findMany({
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
    logger.info(`Fetched test series for user ID ${userId} in month ${month} of year ${year}: ${JSON.stringify(testSeries)}`);
    return testSeries;
  }

  // Get the user score, best score and average score for recent five testSeries
  static async getUserTestSeriesScore(userId: number) {
    const userTestSeries = await prisma.userTestSeries.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        testId: true,
        score: true,
      },
    });
    logger.info(`Fetched user test series scores for user ID ${userId}: ${JSON.stringify(userTestSeries)}`);
    return userTestSeries;
  }

  // Get the average score for a specific test
  static async getAverageScore(testId: number) {
    const averageScore = await prisma.userTestSeries.aggregate({
      _avg: {
        score: true,
      },
      where: {
        testId,
      },
    });
    logger.info(`Calculated average score for test ID ${testId}: ${JSON.stringify(averageScore)}`);
    return averageScore._avg.score || undefined;
  }

  // Get the best score for a specific test
  static async getBestScore(testId: number) {
    const bestScore = await prisma.userTestSeries.findFirst({
      where: { testId },
      orderBy: { score: 'desc' },
      select: {
        score: true,
      },
    });
    logger.info(`Fetched best score for test ID ${testId}: ${JSON.stringify(bestScore)}`);
    return bestScore ? bestScore.score : undefined;
  }

  // Get a specific test for a user
  static async getUserTest(id: number) {
    const userTest = await prisma.userTests.findUnique({
      where: { id },
    });
    logger.info(`Fetched user test with ID ${id}: ${JSON.stringify(userTest)}`);
    return userTest;
  }

  // Get a specific test series for a user
  static async getOneUserTestSeries(id: number) {
    const userTestSeries = await prisma.userTestSeries.findUnique({
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
    logger.info(`Fetched user test series with ID ${id}: ${JSON.stringify(userTestSeries)}`);
    return userTestSeries;
  }

  // Store a new test for a user
  static async storeUserTest(data: IUserTest) {
    const userTest = await prisma.userTests.create({
      data: {
        userId: data.userId!,
        questionIds: data.questionIds,
        response: JSON.stringify(data),
        result: JSON.stringify(data),
      },
    });
    logger.info(`Stored user test: ${JSON.stringify(userTest)}`);
    return userTest;
  }

  // Store a new test series for a user
  static async storeUserTestSeries(data: IUserTestSeries) {
    const userTestSeries = await prisma.userTestSeries.create({
      data: {
        userId: data.userId!,
        response: JSON.stringify(data),
        score: data.score,
        result: JSON.stringify(data),
        testId: data.testId!,
      },
    });
    logger.info(`Stored user test series: ${JSON.stringify(userTestSeries)}`);
    return userTestSeries;
  }

  // Update an existing test for a user
  static async updateUserTest(id: number, data: Partial<IUserTest>) {
    const updatedUserTest = await prisma.userTests.update({
      where: { id },
      data: {
        questionIds: data.questionIds,
        response: JSON.stringify(data),
        result: JSON.stringify(data),
      },
    });
    logger.info(`Updated user test with ID ${id}: ${JSON.stringify(updatedUserTest)}`);
    return updatedUserTest;
  }

  // Update an existing test series for a user
  static async updateUserTestSeries(id: number, data: Partial<IUserTestSeries>) {
    const updatedUserTestSeries = await prisma.userTestSeries.update({
      where: { id },
      data: {
        testId: data.testId!,
        response: JSON.stringify(data),
        result: JSON.stringify(data),
      },
    });
    logger.info(`Updated user test series with ID ${id}: ${JSON.stringify(updatedUserTestSeries)}`);
    return updatedUserTestSeries;
  }
}