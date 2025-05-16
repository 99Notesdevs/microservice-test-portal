import { TestRepository } from "../repositories/TestRepository";
import { ITest } from "../interfaces/tests.interface";

export class TestService {
  static async getAllTests() {
    const tests = await TestRepository.getAllTests();
    return tests;
  }

  static async getTestById(id: number) {
    const test = await TestRepository.getTestById(id);
    if (!test) {
      throw new Error(`Test with ID ${id} not found`);
    }
    return test;
  }

  static async createTest(data: ITest) {
    const newTest = await TestRepository.createTest(data);
    return newTest;
  }

  static async updateTest(id: number, data: Partial<ITest>) {
    const test = await TestRepository.getTestById(id);
    if (!test) {
      throw new Error(`Test with ID ${id} not found`);
    }
    const updated = await TestRepository.updateTest(id, data);
    return updated;
  }

  static async deleteTest(id: number) {
    const test = await TestRepository.getTestById(id);
    if (!test) {
      throw new Error(`Test with ID ${id} not found`);
    }
    const deleted = await TestRepository.deleteTest(id);
    return deleted;
  }
}