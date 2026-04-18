import { prisma } from "../config/prisma";
import logger from "../utils/logger";

export class CalendarRepository {
  static async createEvent(data: {
    userId: number;
    date: number;
    month: number;
    year: number;
    status?: string;
    event: string;
  }) {
    logger.info(`Creating event for user ${data.userId} on ${data.date}/${data.month}/${data.year}`);
    return await prisma.userCalendar.create({
      data: {
        userId: data.userId,
        date: data.date,
        month: data.month,
        year: data.year,
        status: data.status ?? "pending",
        event: data.event,
      },
    });
  }

  static async getEventsByUser(userId: number) {
    logger.info(`Fetching all events for user ${userId}`);
    return await prisma.userCalendar.findMany({
      where: { userId },
      orderBy: [{ year: "desc" }, { month: "desc" }, { date: "desc" }],
    });
  }

  static async getCurrentAffairVisitsByUser(userId: number) {
    logger.info(`Fetching all current affair visits for user ${userId}`);
    return await prisma.$queryRaw<Array<{ id: number; userId: number; date: Date; createdAt: Date }>>`
      SELECT "id", "userId", "date", "createdAt"
      FROM "CurrentAffairVisit"
      WHERE "userId" = ${userId}
      ORDER BY "date" DESC
    `;
  }

  static async getEventsByDate(userId: number, date: number, month: number, year: number) {
    logger.info(`Fetching events for user ${userId} on ${date}/${month}/${year}`);
    return await prisma.userCalendar.findMany({
      where: { userId, date, month, year },
    });
  }

  static async getCurrentAffairVisitsByDate(userId: number, date: number, month: number, year: number) {
    logger.info(`Fetching current affair visits for user ${userId} on ${date}/${month}/${year}`);
    const startOfDayUtc = new Date(Date.UTC(year, month - 1, date));
    const endOfDayUtc = new Date(Date.UTC(year, month - 1, date + 1));

    return await prisma.$queryRaw<Array<{ id: number; userId: number; date: Date; createdAt: Date }>>`
      SELECT "id", "userId", "date", "createdAt"
      FROM "CurrentAffairVisit"
      WHERE "userId" = ${userId}
        AND "date" >= ${startOfDayUtc}
        AND "date" < ${endOfDayUtc}
      ORDER BY "date" DESC
    `;
  }

  static async updateEvent(id: number, data: Partial<{ status: string; event: string }>) {
    logger.info(`Updating event with ID: ${id} with data:`, data);
    return await prisma.userCalendar.update({
      where: { id },
      data,
    });
  }

  static async deleteEvent(id: number) {
    logger.info(`Deleting event with ID: ${id}`);
    return await prisma.userCalendar.delete({
      where: { id },
    });
  }
}