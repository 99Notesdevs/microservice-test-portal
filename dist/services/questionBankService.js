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
exports.QuestionBankService = void 0;
const questionBankRepository_1 = require("../repositories/questionBankRepository");
const examRepository_1 = require("../repositories/examRepository");
const logger_1 = __importDefault(require("../utils/logger"));
const categoryService_1 = __importDefault(require("./categoryService"));
class QuestionBankService {
    static getTestQuestions(categoryIds, limit, multiplechoice) {
        return __awaiter(this, void 0, void 0, function* () {
            // Refine category ids -- returns an array of numbers
            const categories = yield categoryService_1.default.getCategoriesByIds(categoryIds);
            const refinedCategoryIds = categories.map((category) => category.id);
            // Fetch once across all selected categories to avoid duplicate questions
            // when a question belongs to multiple selected categories.
            const questions = yield questionBankRepository_1.QuestionBankRepository.getQuestionsByCategoryId(refinedCategoryIds, limit, multiplechoice);
            return questions;
        });
    }
    static getAllQuestions(categoryIds_1) {
        return __awaiter(this, arguments, void 0, function* (categoryIds, limit = 5) {
            const questions = yield questionBankRepository_1.QuestionBankRepository.getAllQuestions(categoryIds, limit);
            return questions;
        });
    }
    static getQuestionByIds(parsedIds) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = {};
            for (const id of parsedIds) {
                const question = yield questionBankRepository_1.QuestionBankRepository.getQuestionById(id);
                result = Object.assign(Object.assign({}, result), { [`${id}`]: question });
            }
            logger_1.default.info(`Done fetching...`);
            return result;
        });
    }
    static getPracticeQuestions(categoryId, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const questions = yield questionBankRepository_1.QuestionBankRepository.getPracticeQuestionsByCategoryId(categoryId, limit);
            return questions;
        });
    }
    static getQuestionById(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = yield questionBankRepository_1.QuestionBankRepository.getQuestionById(questionId);
            return question;
        });
    }
    static createQuestion(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let examId = (_a = data.examId) !== null && _a !== void 0 ? _a : null;
            if (!examId && data.examName) {
                const exam = yield examRepository_1.ExamRepository.findOrCreateByName(data.examName);
                examId = exam.id;
            }
            const question = yield questionBankRepository_1.QuestionBankRepository.createQuestion(Object.assign(Object.assign({}, data), { examId }));
            return question;
        });
    }
    static updateQuestion(questionId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let examId = (_a = data.examId) !== null && _a !== void 0 ? _a : null;
            if (!examId && data.examName) {
                const exam = yield examRepository_1.ExamRepository.findOrCreateByName(data.examName);
                examId = exam.id;
            }
            const payload = Object.assign(Object.assign({}, data), { examId });
            const question = yield questionBankRepository_1.QuestionBankRepository.updateQuestion(questionId, payload);
            return question;
        });
    }
    static deleteQuestion(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = yield questionBankRepository_1.QuestionBankRepository.deleteQuestion(questionId);
            return question;
        });
    }
}
exports.QuestionBankService = QuestionBankService;
