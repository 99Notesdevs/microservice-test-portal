import { prisma } from "../config/prisma";
import logger from "../utils/logger";
import redis from "../config/RedisClient";

export class ProgressConstraintsRepository {
  private static cacheTTL = 60 * 60;

  static async getProgressConstraintsById(id: number) {
    logger.info(`Fetching progress constraints by ID: ${id}`);
    const cacheKey = `progressConstraints:${id}`;
    const cachedProgressConstraints = await redis.get(cacheKey);
    if (cachedProgressConstraints) {
      logger.info(`Returning cached progress constraints for ID: ${id}`);
      return JSON.parse(cachedProgressConstraints);
    }

    const progressConstraints = await prisma.progressConstraints.findUnique({
    where: { id },
    });

    if (!progressConstraints) {
      logger.warn(`Progress constraints with ID ${id} not found`);
      throw new Error(`Progress constraints with ID ${id} not found`);
    }
    await redis.setex(cacheKey, this.cacheTTL, JSON.stringify(progressConstraints));
    logger.info(`Fetched progress constraints for ID: ${id}`);
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
    await redis.setex(`progressConstraints:${id}`, this.cacheTTL, JSON.stringify(updatedProgressConstraints));
    logger.info(`Updated progress constraints for ID: ${id}`);
    return updatedProgressConstraints;
  }
}