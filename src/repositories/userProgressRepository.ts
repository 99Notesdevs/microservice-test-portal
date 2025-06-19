import { prisma } from "../config/prisma";

export class UserProgressRepository {
  // Get user progress for a specific user
  static async getUserProgress(userId: number) {
    const userProgress = await prisma.userProgress.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 30, // Get the last 30 days of progress
    });
    return userProgress;
  }

  static async getUserProgressByDate(userId: number, date: Date) {
    const progress = await prisma.userProgress.findUnique({
      where: {
        userId_date: {
          userId,
          date: new Date(date.setHours(0, 0, 0, 0)), // Normalize date to start of the day
        },
      },
    });
    return progress;
  }

  // Update user progress for a specific user
  static async updateUserProgress(userId: number, progressMin: number, progressMax: number) {
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