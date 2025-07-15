import { prisma } from "../config/prisma";
import logger from "../utils/logger";
import redis from "../config/RedisClient";

export class AdminMessageRepository {
    private static cacheTTL = 60 * 60;

    static async getGlobalMessages(skip: number, take: number) {
        logger.info(`Fetching global messages with skip: ${skip}, take: ${take}`);
        try {
            const cacheKey = `globalMessages:${skip}:${take}`;
            const cachedMessages = await redis.get(cacheKey);
            if (cachedMessages) {
                logger.info("Returning cached global messages");
                return JSON.parse(cachedMessages);
            }

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
            await redis.setex(cacheKey, this.cacheTTL, JSON.stringify(messages));
            logger.info(`Fetched ${messages.length} global messages`);
            return messages;
        } catch (error) {
            logger.error("Error fetching global messages:", error);
            throw new Error("Failed to fetch global messages");
        }
    }

    static async getMessageByRating(rating: number, skip: number, take: number) {
        logger.info(`Fetching range messages with rating: ${rating}, skip: ${skip}, take: ${take}`);
        const cacheKey = `rangeMessages:${rating}:${skip}:${take}`;
        const cachedMessages = await redis.get(cacheKey);
        if (cachedMessages) {
            logger.info("Returning cached range messages");
            return JSON.parse(cachedMessages);
        }

        try {
            const messages = await prisma.adminMessages.findMany({
                where: {
                    type: "range",
                    ratingS: {
                        lte: rating,
                    },
                    ratingE: {
                        gte: rating,
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
                skip,
                take,
            });

            if(messages.length === 0) {
                logger.warn(`No range messages found for rating: ${rating}`);
                return [];
            }
            await redis.setex(cacheKey, this.cacheTTL, JSON.stringify(messages));
            logger.info(`Fetched ${messages.length} range messages`);
            return messages;
        } catch (error) {
            logger.error("Error fetching range messages:", error);
            throw new Error("Failed to fetch range messages");
        }
    }

    static async getMessageById(id: number) {
        logger.info(`Fetching message by ID: ${id}`);
        try {
            const message = await prisma.adminMessages.findUnique({
                where: {
                    id,
                },
            });
            logger.info(`Fetched message by ID: ${id}`);
            return message;
        } catch (error) {
            logger.error("Error fetching message by ID:", error);
            throw new Error("Failed to fetch message by ID");
        }
    }

    static async createMessage(data: {
        type: string;
        content: string;
        ratingS?: number;
        ratingE?: number;
    }) {
        logger.info("Creating a new message with data:", data);
        try {
            const message = await prisma.adminMessages.create({
                data,
            });
            logger.info("Message created successfully:", message);
            await redis.flushall();
            return message;
        } catch (error) {
            logger.error("Error creating message:", error);
            throw new Error("Failed to create message");
        }
    }

    static async updateMessage(id: number, data: {
        type?: string;
        content?: string;
        ratingS?: number;
        ratingE?: number;
    }) {
        logger.info(`Updating message with ID: ${id} with data:`, data);
        try {
            const message = await prisma.adminMessages.update({
                where: {
                    id,
                },
                data,
            });
            logger.info(`Message updated successfully:`, message);
            await redis.flushall();
            return message;
        } catch (error) {
            logger.error("Error updating message:", error);
            throw new Error("Failed to update message");
        }
    }

    static async deleteMessage(id: number) {
        logger.info(`Deleting message with ID: ${id}`);
        try {
            const message = await prisma.adminMessages.delete({
                where: {
                    id,
                },
            });
            logger.info(`Message deleted successfully:`, message);
            await redis.flushall();
            return message;
        } catch (error) {
            logger.error("Error deleting message:", error);
            throw new Error("Failed to delete message");
        }
    }
}