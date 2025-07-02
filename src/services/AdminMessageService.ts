import { AdminMessageRepository } from "../repositories/AdminMessageRepository";

export class AdminMessageService {
  static async getGlobalMessages(skip: number, take: number) {
    return AdminMessageRepository.getGlobalMessages(skip, take);
  }

  static async getMessageByRating(rating: number, skip: number, take: number) {
    return AdminMessageRepository.getMessageByRating(rating, skip, take);
  }

  static async getMessageById(id: number) {
    return AdminMessageRepository.getMessageById(id);
  }

  static async createMessage(data: {
    type: string;
    content: string;
    ratingS?: number;
    ratingE?: number;
  }) {
    return AdminMessageRepository.createMessage(data);
  }

  static async updateMessage(
    id: number,
    data: {
      type?: string;
      content?: string;
      ratingS?: number;
      ratingE?: number;
    }
  ) {
    return AdminMessageRepository.updateMessage(id, data);
  }

  static async deleteMessage(id: number) {
    return AdminMessageRepository.deleteMessage(id);
  }
}
