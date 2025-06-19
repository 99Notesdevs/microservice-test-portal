import { prisma } from "../config/prisma";

export class ProgressConstraintsRepository {
  static async getProgressConstraintsById(id: number) {
    const progressConstraints = await prisma.progressConstraints.findUnique({
    where: { id },
    });
    return progressConstraints;
  }

  static async createProgressConstraints(data: {weakLimit: number; strongLimit: number; xp_status: string}) {
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
}