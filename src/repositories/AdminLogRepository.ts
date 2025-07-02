import { prisma } from "../config/prisma";

export class AdminLogRepository {
  static async createLog({
    method,
    endpoint,
    status,
    user,
    userId,
    details,
  }: {
    method: string;
    endpoint: string;
    status: string;
    user: string | null;
    userId: number | null;
    details: string | null;
  }) {
    return prisma.adminLogs.create({
      data: {
        method,
        endpoint,
        status,
        user,
        userId,
        details,
      },
    });
  }

  static async getLogs() {
    return prisma.adminLogs.findMany({
      orderBy: { createdAt: "desc" },
    });
  }
}