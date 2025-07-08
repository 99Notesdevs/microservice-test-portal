import { prisma } from "../config/prisma";
import logger from "../utils/logger";

export class ProgressConstraintsRepository {
  static async getProgressConstraintsById(id: number) {
    logger.info(`Fetching progress constraints by ID: ${id}`);
    const progressConstraints = await prisma.progressConstraints.findUnique({
    where: { id },
    });
    return progressConstraints;
  }

  static async createProgressConstraints(data: {weakLimit: number; strongLimit: number; xp_status: string}) {
    logger.info(`Creating progress constraints with data:`, data);
    const newProgressConstraints = await prisma.progressConstraints.upsert({
        where: { id: 1 },
        update: {
            weakLimit: data.weakLimit,
            strongLimit: data.strongLimit,
            xp_status: data.xp_status,
        },
        create: {
            weakLimit: data.weakLimit,
            strongLimit: data.strongLimit,
            xp_status: data.xp_status,
        }
    });
    return newProgressConstraints;
  }

  static async updateProgressConstraints(id: number, data: {weakLimit: number; strongLimit: number; xp_status: string}) {
    logger.info(`Updating progress constraints with ID: ${id} with data:`, data);
    const updatedProgressConstraints = await prisma.progressConstraints.update({
      where: { id },
      data: {
        weakLimit: data.weakLimit,
        strongLimit: data.strongLimit,
        xp_status: data.xp_status,
      },
    });
    return updatedProgressConstraints;
  }
}