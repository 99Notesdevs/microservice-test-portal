import { prisma } from "../config/prisma";
import { ITest } from "../interfaces/tests.interface";
import logger from "../utils/logger";


export class TestRepository {
    static async getAllTests() {
        const tests = await prisma.tests.findMany();
        logger.info(`Fetched all tests: ${JSON.stringify(tests)}`);
        return tests;
    }

    static async getTestById(id: number) {
        const test = await prisma.tests.findUnique({
            where: { id },
        });
        logger.info(`Fetched test by ID ${id}: ${JSON.stringify(test)}`);
        return test;
    }

    static async createTest(data: ITest) {
        const test = await prisma.tests.create({
            data,
        });
        logger.info(`Created test: ${JSON.stringify(test)}`);
        return test;
    }

    static async updateTest(id: number, data: Partial<ITest>) {
        const test = await prisma.tests.update({
            where: { id },
            data,
        });
        logger.info(`Updated test: ${JSON.stringify(test)}`);
        return test;
    }

    static async deleteTest(id: number) {
        const test = await prisma.tests.delete({
            where: { id },
        });
        logger.info(`Deleted test: ${JSON.stringify(test)}`);
        return test;
    }
}