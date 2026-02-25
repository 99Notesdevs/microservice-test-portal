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
exports.createSubmitConsumer = exports.kafka = void 0;
const questionBankService_1 = require("../../../services/questionBankService");
const logger_1 = __importDefault(require("../../logger"));
const kafkajs_1 = require("kafkajs");
const socketInstance_1 = require("../../../config/socketInstance");
const producer_1 = require("../producer");
exports.kafka = new kafkajs_1.Kafka({
    clientId: 'my-test-portal',
    brokers: ['kafka:9092'],
});
const createSubmitConsumer = () => __awaiter(void 0, void 0, void 0, function* () {
    const consumer = exports.kafka.consumer({ groupId: 'submit-group' });
    yield consumer.connect();
    yield consumer.subscribe({ topic: 'question-submit', fromBeginning: false });
    logger_1.default.info(`Consumer connected to topic ${'question-submit'} with group ID ${'submit-group'}`);
    yield consumer.run({
        eachMessage: (_a) => __awaiter(void 0, [_a], void 0, function* ({ topic, partition, message }) {
            var _b, _c;
            logger_1.default.info(`Received message from topic ${topic}: ${(_b = message.value) === null || _b === void 0 ? void 0 : _b.toString()} on partition ${partition}`);
            const { submissions, markingScheme, userId } = JSON.parse(((_c = message.value) === null || _c === void 0 ? void 0 : _c.toString()) || '{}');
            /*
              Example of data recieived from client:
      
              {
                "submissions": [
                  {
                    "questionId": 1,
                    "selectedOption": "1, 2"
                  },
                  {
                    "questionId": 2,
                    "selectedOption": "2, 3"
                  },
                  {
                    "questionId": 3,
                    "selectedOption": "1"
                  }
                ],
                "markingScheme": {
                  "correct": 4,
                  "incorrect": -1,
                  "unattempted": 0,
                  "partial": 2,
                  "partialWrong": -2,
                  "partialUnattempted": -1
                },
                userId: 1
              }
      
            */
            const result = {};
            let score = 0;
            for (const sub of submissions) {
                const { questionId, selectedOption } = sub;
                const question = yield questionBankService_1.QuestionBankService.getQuestionById(Number(questionId));
                if (question) {
                    const isMultipleChoice = question.multipleCorrectType ? 1 : 0; // 0 for single choice, 1 for multiple choice
                    switch (isMultipleChoice) {
                        case 0:
                            if (selectedOption === 'unattempted') {
                                result[questionId] = Object.assign(Object.assign({}, question), { isCorrect: false, selectedOption });
                                score += markingScheme.unattempted;
                            }
                            else if (question.answer === selectedOption) {
                                result[questionId] = Object.assign(Object.assign({}, question), { isCorrect: true, selectedOption });
                                score += markingScheme.correct;
                            }
                            else {
                                result[questionId] = Object.assign(Object.assign({}, question), { isCorrect: false, selectedOption });
                                score += markingScheme.incorrect;
                            }
                            break;
                        case 1:
                            const selectedOptions = selectedOption.split(',');
                            const correctOptions = question.answer.split(',');
                            const allCorrect = correctOptions.every(option => selectedOptions.includes(option));
                            // @ts-ignore
                            const hasIncorrectOption = selectedOptions.some(option => !correctOptions.includes(option));
                            // First check unattempter, then check check for wrong options, then for all correct and partially correct
                            // Check the T F status on the frontend
                            if (selectedOptions.length === 0) {
                                score += markingScheme.partialUnattempted;
                                result[questionId] = Object.assign(Object.assign({}, question), { isCorrect: true, isPartiallyCorrect: false, selectedOption }); // T F -- Unattempted
                            }
                            else if (hasIncorrectOption) {
                                score += markingScheme.partialWrong;
                                result[questionId] = Object.assign(Object.assign({}, question), { isCorrect: false, isPartiallyCorrect: false, selectedOption }); // F F -- Incorrect
                            }
                            else if (allCorrect) {
                                score += markingScheme.partial * correctOptions.length;
                                result[questionId] = Object.assign(Object.assign({}, question), { isCorrect: true, isPartiallyCorrect: true, selectedOption }); // T T -- Correct
                            }
                            else {
                                // @ts-ignore
                                const correctSelectedCount = selectedOptions.filter(option => correctOptions.includes(option)).length;
                                score += markingScheme.partial * correctSelectedCount;
                                result[questionId] = Object.assign(Object.assign({}, question), { isCorrect: false, isPartiallyCorrect: true, selectedOption }); // F T -- Partially Correct
                            }
                            break;
                        default:
                            logger_1.default.error(`Invalid multiple choice type for question ID ${questionId}`);
                            break;
                    }
                }
            }
            // Emit socket event to a userId
            const io = (0, socketInstance_1.getSocketInstance)();
            if (!io)
                logger_1.default.error("Socket instance is not available");
            else
                logger_1.default.info(`Emitted fetch-questions event to room-${userId}`);
            io.to(`room-${userId}`).emit(`submit-questions`, {
                result,
                score,
                status: 'success',
                userId
            });
            yield (0, producer_1.sendMessage)('user-rating', {
                userId,
                result
            });
        }),
    });
});
exports.createSubmitConsumer = createSubmitConsumer;
