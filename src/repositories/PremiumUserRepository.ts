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
    });
    logger.info(`Fetched test series for user ID ${userId}: ${JSON.stringify(userTestSeries)}`);
    return userTestSeries;
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
        testId: data.testId!,
        response: JSON.stringify(data),
        result: JSON.stringify(data),
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