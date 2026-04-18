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
    static getQuestionsByCategoryId(categoryIds, limit, multiplechoice) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info("getQuestionsByCategoryId called", { categoryIds, limit, multiplechoice });
            const categoryIdsCsv = categoryIds.join(',');
            const questions = yield prisma_1.prisma.$queryRawUnsafe(`
                WITH unique_questions AS (
                    SELECT DISTINCT qb.id
                    FROM "QuestionBank" qb
                    INNER JOIN "_CategoryToQuestionBank" tqb ON qb.id = tqb."B"
                    WHERE tqb."A" = ANY (string_to_array($1, ',')::int[])
                      AND qb."multipleCorrectType" = ($3)
                )
                SELECT qb.*
                FROM "QuestionBank" qb
                INNER JOIN unique_questions uq ON qb.id = uq.id
                ORDER BY random()
                LIMIT ($2)
            `, categoryIdsCsv, limit, !!multiplechoice);
            logger_1.default.info("getQuestionsByCategoryId result", { length: questions.length });
            return questions;
        });
    }
    static getPracticeQuestionsByCategoryId(categoryId, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info("getPracticeQuestionsByCategoryId called", { categoryId, limit });
            const allQuestions = yield prisma_1.prisma.questionBank.findMany({
                where: {
                    categories: {
                        some: { id: categoryId },
                    },
                },
                include: {
                    categories: {
                        select: { id: true, name: true },
                    },
                },
            });
            // Fisher-Yates shuffle
            for (let i = allQuestions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
            }
            const questions = allQuestions.slice(0, limit);
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
                    exam: true,
                },
            });
            logger_1.default.info("getQuestionById result", { found: !!question });
            return question;
        });
    }
    static getAllQuestions(categoryIds, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info("getAllQuestions called", { categoryIds });
            const categoryIdsCsv = categoryIds.join(',');
            const questions = yield prisma_1.prisma.$queryRawUnsafe(`
                SELECT qb.*, COALESCE(json_agg(json_build_object('id', c.id, 'name', c.name)) FILTER (WHERE c.id IS NOT NULL), '[]') as categories
                FROM "QuestionBank" qb
                LEFT JOIN "_CategoryToQuestionBank" tqb ON qb.id = tqb."B"
                LEFT JOIN "Categories" c ON c.id = tqb."A"
                WHERE qb.id IN (
                  SELECT t2."B"
                  FROM "_CategoryToQuestionBank" t2
                  WHERE t2."A" = ANY (string_to_array($1, ',')::int[])
                )
                GROUP BY qb.id
                ORDER BY random()
                LIMIT ($2)
            `, categoryIdsCsv, limit);
            logger_1.default.info("getAllQuestions result", { length: questions.length });
            return questions;
        });
    }
    static getRandomQuestions(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info("getAllQuestions ", { limit });
            const questions = yield prisma_1.prisma.$queryRawUnsafe(`SELECT * FROM "QuestionBank" ORDER BY RANDOM() LIMIT ($1)`, limit);
            logger_1.default.info("getAllQuestions result", { length: questions.length });
            return questions;
        });
    }
    static createQuestion(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            logger_1.default.info("createQuestion called", Object.assign(Object.assign({}, data), { optionsLength: data.options.length, categoryIdsLength: data.categoryIds.length }));
            const question = yield prisma_1.prisma.questionBank.create({
                data: Object.assign(Object.assign({ question: data.question, answer: data.answer, options: data.options, categories: {
                        connect: data.categoryIds.map(id => ({ id: Number(id) })),
                    }, creatorName: data.creatorName, explaination: data.explaination, multipleCorrectType: data.multipleCorrectType, pyq: data.pyq, year: data.year, rating: data.rating, isCurrentAffair: (_a = data.isCurrentAffair) !== null && _a !== void 0 ? _a : false, currentAffairArticleId: (_b = data.currentAffairArticleId) !== null && _b !== void 0 ? _b : undefined }, (typeof data.completed === 'boolean' ? { completed: data.completed } : {})), { examId: (_c = data.examId) !== null && _c !== void 0 ? _c : undefined }),
                include: { exam: true, currentAffairArticle: true },
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
            var _a, _b;
            logger_1.default.info("updateQuestion called", Object.assign(Object.assign({ questionId }, data), { optionsLength: (_a = data.options) === null || _a === void 0 ? void 0 : _a.length, categoryIdsLength: (_b = data.categoryIds) === null || _b === void 0 ? void 0 : _b.length }));
            const question = yield prisma_1.prisma.questionBank.update({
                where: {
                    id: questionId,
                },
                data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ question: data.question, answer: data.answer, options: data.options }, (data.categoryIds && data.categoryIds.length > 0 && {
                    categories: {
                        set: data.categoryIds.map(id => ({ id: Number(id) })),
                    },
                })), { creatorName: data.creatorName, explaination: data.explaination, multipleCorrectType: data.multipleCorrectType, pyq: data.pyq, year: data.year, rating: data.rating }), (data.hasOwnProperty('isCurrentAffair') ? { isCurrentAffair: data.isCurrentAffair } : {})), (data.hasOwnProperty('currentAffairArticleId') ? { currentAffairArticleId: data.currentAffairArticleId } : {})), (typeof data.completed === 'boolean' ? { completed: data.completed } : {})), (data.hasOwnProperty('examId') ? { examId: data.examId } : {})),
                include: { exam: true, currentAffairArticle: true },
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
