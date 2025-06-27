import { CalendarRepository } from "../repositories/CalendarRepository";
import { PremiumUserRepository } from "../repositories/PremiumUserRepository";

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
    return await CalendarRepository.getEventsByUser(userId);
  }

  static async getEventsByDate(userId: number, date: number, month: number, year: number) {
    return await CalendarRepository.getEventsByDate(userId, date, month, year);
  }

  static async updateEvent(id: number, data: Partial<{ status: string; event: string }>) {
    return await CalendarRepository.updateEvent(id, data);
  }

  static async deleteEvent(id: number) {
    return await CalendarRepository.deleteEvent(id);
  }
}