import { prisma } from "../config/prisma";
import logger from "../utils/logger";

export class UserProgressRepository {
  static async getUserProgress(userId: number) {
    logger.info(`Fetching user progress for user ${userId}`);
    const userProgress = await prisma.userProgress.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 30,
    });
    return userProgress;
  }

  static async getUserProgressByDate(userId: number, date: Date) {
    logger.info(`Fetching user progress for user ${userId} on date ${date}`);
    const progress = await prisma.userProgress.findUnique({
      where: {
        userId_date: {
          userId,
          date: new Date(date.setHours(0, 0, 0, 0)),
        },
      },
    });
    return progress;
  }

  static async updateUserProgress(userId: number, progressMin: number, progressMax: number) {
    logger.info(`Updating user progress for user ${userId} with min: ${progressMin}, max: ${progressMax}`);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const updatedProgress = await prisma.userProgress.upsert({
      where: { userId_date: { userId, date: today } },
      update: { progressMin, progressMax },
      create: { userId, progressMin, progressMax, date: today },
    });
    return updatedProgress;
  }
}