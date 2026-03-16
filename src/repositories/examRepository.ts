import { prisma } from "../config/prisma";
import logger from "../utils/logger";

export class ExamRepository {
    static async findOrCreateByName(name: string) {
        logger.info("findOrCreateByName called", { name });
        const existing = await prisma.exam.findUnique({ where: { name } });
        if (existing) return existing;
        const created = await prisma.exam.create({ data: { name } });
        logger.info("findOrCreateByName created", { id: created.id });
        return created;
    }

    static async findById(id: number) {
        return prisma.exam.findUnique({ where: { id } });
    }
}
