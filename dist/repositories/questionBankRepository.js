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
exports.QuestionBankRepository = void 0;
const prisma_1 = require("../config/prisma");
const logger_1 = __importDefault(require("../utils/logger"));
class QuestionBankRepository {
    static getQuestionsByCategoryId(categoryId, limit, multiplechoice) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info("getQuestionsByCategoryId called", { categoryId, limit, multiplechoice });
            const questions = yield prisma_1.prisma.$queryRawUnsafe(`
                SELECT * FROM "QuestionBank"
                WHERE "categoryId" = ($1) AND "multipleCorrectType" = ($3)
                ORDER BY random()
                LIMIT ($2)
            `, categoryId, limit, !!multiplechoice);
            logger_1.default.info("getQuestionsByCategoryId result", { length: questions.length });
            return questions;
        });
    }
    static getPracticeQuestionsByCategoryId(categoryId, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info("getPracticeQuestionsByCategoryId called", { categoryId, limit });
            const questions = yield prisma_1.prisma.questionBank.findMany({
                where: {
                    categories: {
                        id: categoryId,
                    },
                    pyq: true
                },
                orderBy: {
                    createdAt: 'desc',
                },
                take: limit,
            });
            logger_1.default.info("getPracticeQuestionsByCategoryId result", { length: questions.length });
            return questions;
        });
    }
    static getQuestionById(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info("getQuestionById called", { questionId });
            const question = yield prisma_1.prisma.questionBank.findUnique({
                where: {
                    id: questionId,
                },
                include: {
                    categories: true,
                },
            });
            logger_1.default.info("getQuestionById result", { found: !!question });
            return question;
        });
    }
    static getAllQuestions(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info("getAllQuestions called", { categoryId });
            const questions = yield prisma_1.prisma.questionBank.findMany({
                where: {
                    categories: {
                        id: categoryId,
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            logger_1.default.info("getAllQuestions result", { length: questions.length });
            return questions;
        });
    }
    static createQuestion(data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info("createQuestion called", Object.assign(Object.assign({}, data), { optionsLength: data.options.length }));
            const question = yield prisma_1.prisma.questionBank.create({
                data: {
                    question: data.question,
                    answer: data.answer,
                    options: data.options,
                    categories: {
                        connect: { id: data.categoryId },
                    },
                    creatorName: data.creatorName,
                    explaination: data.explaination,
                    multipleCorrectType: data.multipleCorrectType,
                    pyq: data.pyq,
                    year: data.year,
                    rating: data.rating,
                },
            });
            logger_1.default.info("createQuestion result", { id: question.id });
            return question;
        });
    }
    static updateQuestionAttempts(questionId, correct) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info("updateQuestionAttempts called", { questionId, correct });
            const question = yield prisma_1.prisma.questionBank.update({
                where: {
                    id: questionId,
                },
                data: {
                    totalAttempts: {
                        increment: 1,
                    },
                    correctAttempts: correct === 1 ? {
                        increment: 1,
                    } : undefined,
                },
            });
            logger_1.default.info("updateQuestionAttempts result", { id: question.id });
            return question;
        });
    }
    static updateQuestion(questionId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            logger_1.default.info("updateQuestion called", Object.assign(Object.assign({ questionId }, data), { optionsLength: (_a = data.options) === null || _a === void 0 ? void 0 : _a.length }));
            const question = yield prisma_1.prisma.questionBank.update({
                where: {
                    id: questionId,
                },
                data: Object.assign(Object.assign({ question: data.question, answer: data.answer, options: data.options }, (data.categoryId && {
                    categories: {
                        connect: { id: data.categoryId },
                    },
                })), { creatorName: data.creatorName, explaination: data.explaination, multipleCorrectType: data.multipleCorrectType, pyq: data.pyq, year: data.year, rating: data.rating }),
            });
            logger_1.default.info("updateQuestion result", { id: question.id });
            return question;
        });
    }
    static deleteQuestion(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info("deleteQuestion called", { questionId });
            const question = yield prisma_1.prisma.questionBank.delete({
                where: {
                    id: questionId,
                },
            });
            logger_1.default.info("deleteQuestion result", { id: question.id });
            return question;
        });
    }
}
exports.QuestionBankRepository = QuestionBankRepository;
