import { TestSeriesRepository } from "../repositories/TestSeriesRepository";
import { ITestSeries } from "../interfaces/testSeries.interface";

export class TestSeriesService {
  static async getAllTestSeries() {
    const testSeries = await TestSeriesRepository.getAllTestSeries();
    return testSeries;
  }

  static async getTestSeriesById(id: number) {
    const testSeries = await TestSeriesRepository.getTestSeriesById(id);
    if (!testSeries) {
      throw new Error(`Test series with ID ${id} not found`);
    }
    return testSeries;
  }

  static async createTestSeries(data: ITestSeries) {
    const newtestSeries = await TestSeriesRepository.createTestSeries(data);
    return newtestSeries;
  }

  static async updateTestSeries(id: number, data: Partial<ITestSeries>) {
    const testSeries = await TestSeriesRepository.getTestSeriesById(id);
    if (!testSeries) {
      throw new Error(`Test series with ID ${id} not found`);
    }
    const updated = await TestSeriesRepository.updateTestSeries(id, data);
    return updated;
  }

  static async deleteTestSeries(id: number) {
    const testSeries = await TestSeriesRepository.getTestSeriesById(id);
    if (!testSeries) {
      throw new Error(`Test series with ID ${id} not found`);
    }
    const deleted = await TestSeriesRepository.deleteTestSeries(id);
    return deleted;
  }
}