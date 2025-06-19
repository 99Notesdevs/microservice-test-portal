import { CalendarRepository } from "../repositories/CalendarRepository";

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