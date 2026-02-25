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
exports.createFetchConsumer = exports.kafka = void 0;
const questionBankService_1 = require("../../../services/questionBankService");
const logger_1 = __importDefault(require("../../logger"));
const kafkajs_1 = require("kafkajs");
const socketInstance_1 = require("../../../config/socketInstance");
exports.kafka = new kafkajs_1.Kafka({
    clientId: 'my-test-portal',
    brokers: ['kafka:9092'],
});
const createFetchConsumer = () => __awaiter(void 0, void 0, void 0, function* () {
    const consumer = exports.kafka.consumer({ groupId: 'fetch-group' });
    yield consumer.connect();
    yield consumer.subscribe({ topic: 'question-fetch', fromBeginning: false });
    logger_1.default.info(`Consumer connected to topic ${'question-fetch'} with group ID ${'fetch-group'}`);
    // console.log(`Consumer connected to topic ${'question-fetch'} with group ID ${'fetch-group'}`)
    yield consumer.run({
        eachMessage: (_a) => __awaiter(void 0, [_a], void 0, function* ({ topic, partition, message }) {
            var _b, _c;
            // console.log(`Received message from topic ${topic}: ${message.value?.toString()} on partition ${partition}`)
            logger_1.default.info(`Received message from topic ${topic}: ${(_b = message.value) === null || _b === void 0 ? void 0 : _b.toString()} on partition ${partition}`);
            const { categoryS, limitS, categoryM, limitM, userId } = JSON.parse(((_c = message.value) === null || _c === void 0 ? void 0 : _c.toString()) || '{}');
            const parsedCategoryIdsS = categoryS.toString().split(',').map((id) => Number(id));
            const questionsS = yield questionBankService_1.QuestionBankService.getTestQuestions(parsedCategoryIdsS, Number(limitS), 0);
            const parsedCategoryIdsM = categoryM.toString().split(',').map((id) => Number(id));
            const questionsM = yield questionBankService_1.QuestionBankService.getTestQuestions(parsedCategoryIdsM, Number(limitM), 1);
            const questions = [...questionsS, ...questionsM];
            // Emit socket event to a userId
            // logger.info(`Questinos: ${JSON.stringify(questions)}`);
            const io = (0, socketInstance_1.getSocketInstance)();
            if (!io)
                logger_1.default.error("Socket instance is not available");
            else
                logger_1.default.info(`Emitted fetch-questions event to room-${userId}`);
            io.to(`room-${userId}`).emit(`fetch-questions`, {
                questions,
                message: `Fetched ${questions.length} questions`,
                status: 'success',
                userId
            });
        }),
    });
});
exports.createFetchConsumer = createFetchConsumer;
