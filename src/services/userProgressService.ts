import { UserProgressRepository } from "../repositories/userProgressRepository";

export class UserProgressService {
  // Get user progress for a specific user
  static async getUserProgress(userId: number) {
    return await UserProgressRepository.getUserProgress(userId);
  }

  // Get user progress for a specific date
  static async getUserProgressByDate(userId: number, date: Date) {
    return await UserProgressRepository.getUserProgressByDate(userId, date);
  }

  // Update user progress for a specific user
  static async updateUserProgress(userId: number, progress: number) {
    const currentProgress = await UserProgressRepository.getUserProgressByDate(userId, new Date());
    let progressMin = currentProgress?.progressMin || progress;
    let progressMax = currentProgress?.progressMax || progress;
    progressMin = Math.min(progressMin, progress);
    progressMax = Math.max(progressMax, progress);
    return await UserProgressRepository.updateUserProgress(userId, progressMin, progressMax);
  }
}