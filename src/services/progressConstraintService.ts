import { ProgressConstraintsRepository } from "../repositories/progressContraintsRepository";
import logger from "../utils/logger";

export class ProgressConstraintsService {
  static async getProgressConstraintsById(id: number) {
    const progressConstraints = await ProgressConstraintsRepository.getProgressConstraintsById(id);
    if (!progressConstraints) {
      logger.warn(`Progress constraints not found for ID: ${id}`);
    }
    return progressConstraints;
  }

  static async createProgressConstraints(data: { weakLimit: number; strongLimit: number; xp_status: string }) {
    const newProgressConstraints = await ProgressConstraintsRepository.createProgressConstraints(data);
    logger.info(`Created new progress constraints with ID: ${newProgressConstraints.id}`);
    return newProgressConstraints;
  }

  static async updateProgressConstraints(id: number, data: { weakLimit: number; strongLimit: number; xp_status: string }) {
    const updatedProgressConstraints = await ProgressConstraintsRepository.updateProgressConstraints(id, data);
    if (!updatedProgressConstraints) {
      logger.warn(`Progress constraints not found for ID: ${id}`);
      return null;
    }
    logger.info(`Updated progress constraints with ID: ${id}`);
    return updatedProgressConstraints;
  }
}
