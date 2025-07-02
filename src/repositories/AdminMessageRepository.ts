import { prisma } from "../config/prisma";

export class AdminMessageRepository {
    static async getGlobalMessages(skip: number, take: number) {
        try {
            const messages = await prisma.adminMessages.findMany({
                where: {
                    type: "global",
                },
                skip,
                take,
                orderBy: {
                    createdAt: "desc",
                },
            });
            return messages;
        } catch (error) {
            console.error("Error fetching global messages:", error);
            throw new Error("Failed to fetch global messages");
        }
    }

    static async getMessageByRating(rating: number, skip: number, take: number) {
        try {
            const messages = await prisma.adminMessages.findMany({
                where: {
                    type: "range",
                    ratingS: {
                        lte: rating,
                    },
                    ratingE: {
                        lte: rating,
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
                skip,
                take,
            });
            return messages;
        } catch (error) {
            console.error("Error fetching range messages:", error);
            throw new Error("Failed to fetch range messages");
        }
    }

    static async getMessageById(id: number) {
        try {
            const message = await prisma.adminMessages.findUnique({
                where: {
                    id,
                },
            });
            return message;
        } catch (error) {
            console.error("Error fetching message by ID:", error);
            throw new Error("Failed to fetch message by ID");
        }
    }

    static async createMessage(data: {
        type: string;
        content: string;
        ratingS?: number;
        ratingE?: number;
    }) {
        try {
            const message = await prisma.adminMessages.create({
                data,
            });
            return message;
        } catch (error) {
            console.error("Error creating message:", error);
            throw new Error("Failed to create message");
        }
    }

    static async updateMessage(id: number, data: {
        type?: string;
        content?: string;
        ratingS?: number;
        ratingE?: number;
    }) {
        try {
            const message = await prisma.adminMessages.update({
                where: {
                    id,
                },
                data,
            });
            return message;
        } catch (error) {
            console.error("Error updating message:", error);
            throw new Error("Failed to update message");
        }
    }

    static async deleteMessage(id: number) {
        try {
            const message = await prisma.adminMessages.delete({
                where: {
                    id,
                },
            });
            return message;
        } catch (error) {
            console.error("Error deleting message:", error);
            throw new Error("Failed to delete message");
        }
    }
}