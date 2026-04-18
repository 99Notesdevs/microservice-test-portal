import { CalendarRepository } from "../repositories/CalendarRepository";
import { PremiumUserRepository } from "../repositories/PremiumUserRepository";

type CalendarEventResponse = {
  id: number | string;
  userId: number;
  date: number;
  month: number;
  year: number;
  status: string;
  event: string;
  type?: string;
  readOnly?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

function mapCurrentAffairVisitToCalendarEvent(visit: {
  id: number;
  userId: number;
  date: Date;
  createdAt: Date;
}): CalendarEventResponse {
  return {
    id: `ca-visit-${visit.id}`,
    userId: visit.userId,
    date: visit.date.getUTCDate(),
    month: visit.date.getUTCMonth() + 1,
    year: visit.date.getUTCFullYear(),
    status: "completed",
    event: "Current Affairs Visit",
    type: "currentAffairVisit",
    readOnly: true,
    createdAt: visit.createdAt,
    updatedAt: visit.createdAt,
  };
}

function sortEventsByDateDesc(a: CalendarEventResponse, b: CalendarEventResponse) {
  if (a.year !== b.year) return b.year - a.year;
  if (a.month !== b.month) return b.month - a.month;
  return b.date - a.date;
}

export class CalendarService {
  static async createEvent(data: {
    userId: number;
    date: number;
    month: number;
    year: number;
    status?: string;
    event: string;
  }) {
    return await CalendarRepository.createEvent(data);
  }

  static async getTests(month: number, year: number, uid: number) {
    const tests = await PremiumUserRepository.getTestsByMonthAndYear(month, year, uid);
    const testSeries = await PremiumUserRepository.getTestSeriesByMonthAndYear(month, year, uid);
    return { tests, testSeries };
  }

  static async getEventsByUser(userId: number) {
    const [events, currentAffairVisits] = await Promise.all([
      CalendarRepository.getEventsByUser(userId),
      CalendarRepository.getCurrentAffairVisitsByUser(userId),
    ]);

    const visitEvents = currentAffairVisits.map(mapCurrentAffairVisitToCalendarEvent);
    return [...events, ...visitEvents].sort(sortEventsByDateDesc);
  }

  static async getEventsByDate(userId: number, date: number, month: number, year: number) {
    const [events, currentAffairVisits] = await Promise.all([
      CalendarRepository.getEventsByDate(userId, date, month, year),
      CalendarRepository.getCurrentAffairVisitsByDate(userId, date, month, year),
    ]);

    const visitEvents = currentAffairVisits.map(mapCurrentAffairVisitToCalendarEvent);
    return [...events, ...visitEvents].sort(sortEventsByDateDesc);
  }

  static async updateEvent(id: number, data: Partial<{ status: string; event: string }>) {
    return await CalendarRepository.updateEvent(id, data);
  }

  static async deleteEvent(id: number) {
    return await CalendarRepository.deleteEvent(id);
  }
}