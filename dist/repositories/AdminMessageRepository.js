"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMessageRepository = void 0;
const prisma_1 = require("../config/prisma");
const logger_1 = __importDefault(require("../utils/logger"));
const RedisClient_1 = __importDefault(require("../config/RedisClient"));
class AdminMessageRepository {
    static getGlobalMessages(skip, take) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Fetching global messages with skip: ${skip}, take: ${take}`);
            try {
                const cacheKey = `globalMessages:${skip}:${take}`;
                const cachedMessages = yield RedisClient_1.default.get(cacheKey);
                if (cachedMessages) {
                    logger_1.default.info("Returning cached global messages");
                    return JSON.parse(cachedMessages);
                }
                const messages = yield prisma_1.prisma.adminMessages.findMany({
                    where: {
                        type: "global",
                    },
                    skip,
                    take,
                    orderBy: {
                        createdAt: "desc",
                    },
                });
                yield RedisClient_1.default.setex(cacheKey, this.cacheTTL, JSON.stringify(messages));
                logger_1.default.info(`Fetched ${messages.length} global messages`);
                return messages;
            }
            catch (error) {
                logger_1.default.error("Error fetching global messages:", error);
                throw new Error("Failed to fetch global messages");
            }
        });
    }
    static getMessageByRating(rating, skip, take) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Fetching range messages with rating: ${rating}, skip: ${skip}, take: ${take}`);
            const cacheKey = `rangeMessages:${rating}:${skip}:${take}`;
            const cachedMessages = yield RedisClient_1.default.get(cacheKey);
            if (cachedMessages) {
                logger_1.default.info("Returning cached range messages");
                return JSON.parse(cachedMessages);
            }
            try {
                const messages = yield prisma_1.prisma.adminMessages.findMany({
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
                if (messages.length === 0) {
                    logger_1.default.warn(`No range messages found for rating: ${rating}`);
                    return [];
                }
                yield RedisClient_1.default.setex(cacheKey, this.cacheTTL, JSON.stringify(messages));
                logger_1.default.info(`Fetched ${messages.length} range messages`);
                return messages;
            }
            catch (error) {
                logger_1.default.error("Error fetching range messages:", error);
                throw new Error("Failed to fetch range messages");
            }
        });
    }
    static getMessageById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Fetching message by ID: ${id}`);
            try {
                const message = yield prisma_1.prisma.adminMessages.findUnique({
                    where: {
                        id,
                    },
                });
                logger_1.default.info(`Fetched message by ID: ${id}`);
                return message;
            }
            catch (error) {
                logger_1.default.error("Error fetching message by ID:", error);
                throw new Error("Failed to fetch message by ID");
            }
        });
    }
    static createMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info("Creating a new message with data:", data);
            try {
                const message = yield prisma_1.prisma.adminMessages.create({
                    data,
                });
                logger_1.default.info("Message created successfully:", message);
                yield RedisClient_1.default.flushall();
                return message;
            }
            catch (error) {
                logger_1.default.error("Error creating message:", error);
                throw new Error("Failed to create message");
            }
        });
    }
    static updateMessage(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Updating message with ID: ${id} with data:`, data);
            try {
                const message = yield prisma_1.prisma.adminMessages.update({
                    where: {
                        id,
                    },
                    data,
                });
                logger_1.default.info(`Message updated successfully:`, message);
                yield RedisClient_1.default.flushall();
                return message;
            }
            catch (error) {
                logger_1.default.error("Error updating message:", error);
                throw new Error("Failed to update message");
            }
        });
    }
    static deleteMessage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info(`Deleting message with ID: ${id}`);
            try {
                const message = yield prisma_1.prisma.adminMessages.delete({
                    where: {
                        id,
                    },
                });
                logger_1.default.info(`Message deleted successfully:`, message);
                yield RedisClient_1.default.flushall();
                return message;
            }
            catch (error) {
                logger_1.default.error("Error deleting message:", error);
                throw new Error("Failed to delete message");
            }
        });
    }
}
exports.AdminMessageRepository = AdminMessageRepository;
AdminMessageRepository.cacheTTL = 60 * 60;
