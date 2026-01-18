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
exports.createRatingConsumer = void 0;
const logger_1 = __importDefault(require("../../logger"));
const kafkajs_1 = require("kafkajs");
const socketInstance_1 = require("../../../config/socketInstance");
const questionBankRepository_1 = require("../../../repositories/questionBankRepository");
const client_1 = require("../../../grpc/client/client");
const attempQuestionService_1 = require("../../../services/attempQuestionService");
const userProgressService_1 = require("../../../services/userProgressService");
const kafka = new kafkajs_1.Kafka({
    clientId: "my-test-portal",
    brokers: ["kafka:9092"],
});
const createRatingConsumer = () => __awaiter(void 0, void 0, void 0, function* () {
    const consumer = kafka.consumer({ groupId: "rating-group" });
    yield consumer.connect();
    yield consumer.subscribe({ topic: "user-rating", fromBeginning: false });
    logger_1.default.info(`Consumer connected to topic ${"user-rating"} with group ID ${"rating-group"}`);
    yield consumer.run({
        eachMessage: (_a) => __awaiter(void 0, [_a], void 0, function* ({ topic, partition, message }) {
            var _b, _c;
            logger_1.default.info(`Received message from topic ${topic}: ${(_b = message.value) === null || _b === void 0 ? void 0 : _b.toString()} on partition ${partition}`);
            const { userId, result } = JSON.parse(((_c = message.value) === null || _c === void 0 ? void 0 : _c.toString()) || "{}");
            let newGlobalRating = 0;
            for (const [questionId, questionValue] of Object.entries(result)) {
                const question = questionValue;
                const { isCorrect, categories, selectedOption } = question;
                const categoryId = parseInt(categories.id);
                const markValue = (!isCorrect && selectedOption === 'unattempted') ? 0 : isCorrect ? 1 : -1;
                // Updating question attempts in the database
                const updateQuestionAttempt = yield questionBankRepository_1.QuestionBankRepository.updateQuestionAttempts(parseInt(questionId), markValue);
                // Do the Elo calculation
                newGlobalRating = yield (0, attempQuestionService_1.attemptQuestionService)(userId, categoryId, markValue, question.rating);
            }
            yield (0, client_1.updateUserRating)(userId, newGlobalRating);
            yield userProgressService_1.UserProgressService.updateUserProgress(userId, newGlobalRating);
            const io = (0, socketInstance_1.getSocketInstance)();
            if (!io)
                logger_1.default.error("Socket instance is not available");
            else {
                io.to(`room-${userId}`).emit(`user-rating`, {
                    userId,
                    overallRating: newGlobalRating,
                    message: "Rating updated successfully",
                });
            }
        }),
    });
});
exports.createRatingConsumer = createRatingConsumer;
// Propagate the category id to the leaves and update the user rating on all the leaves, then recusrsively update the user rating on all the parents
// if leaf then update the user rating on the leaf and then update the user rating on the parent
