import { PremiumUserRepository } from "../repositories/PremiumUserRepository";
import { IUserTest } from "../interfaces/tests.interface";
import { IUserTestSeries } from "../interfaces/testSeries.interface";

type TestSeriesData = {
  testId: number;
  score: number;
  averageScore?: number;
  bestScore?: number;
};

export class PremiumUserService {
  static async getUserTests(userId: number) {
    return await PremiumUserRepository.getUserTests(userId);
  }

  static async getUserTestSeries(userId: number) {
    return await PremiumUserRepository.getUserTestSeries(userId);
  }

  static async getUserTest(id: number) {
    const userTest = await PremiumUserRepository.getUserTest(id);
    if (!userTest) {
      throw new Error(`User test with ID ${id} not found`);
    }
    return userTest;
  }

  static async getOneUserTestSeries(id: number) {
    const userTestSeries = await PremiumUserRepository.getOneUserTestSeries(id);
    if (!userTestSeries) {
      throw new Error(`User test series with ID ${id} not found`);
    }
    return userTestSeries;
  }

  static async getLast5TestSeriesData(userId: number) {
    const last5: TestSeriesData[] = await PremiumUserRepository.getUserTestSeriesScore(userId);
    if (!last5) {
      throw new Error(`No test series found for user ID ${userId}`);
    }
    for(const series of last5) {
      series['averageScore'] = await PremiumUserRepository.getAverageScore(series.testId);
      series['bestScore'] = await PremiumUserRepository.getBestScore(series.testId);
    }
    return last5;
  }

  static async storeUserTest(data: IUserTest) {
    return await PremiumUserRepository.storeUserTest(data);
  }

  static async storeUserTestSeries(data: IUserTestSeries) {
    return await PremiumUserRepository.storeUserTestSeries(data);
  }

  static async updateUserTest(id: number, data: Partial<IUserTest>) {
    const userTest = await PremiumUserRepository.getUserTest(id);
    if (!userTest) {
      throw new Error(`User test with ID ${id} not found`);
    }
    return await PremiumUserRepository.updateUserTest(id, data);
  }

  static async updateUserTestSeries(id: number, data: Partial<IUserTestSeries>) {
    const userTestSeries = await PremiumUserRepository.getOneUserTestSeries(id);
    if (!userTestSeries) {
      throw new Error(`User test series with ID ${id} not found`);
    }
    return await PremiumUserRepository.updateUserTestSeries(id, data);
  }
}