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
const questionBankService_1 = require("../services/questionBankService");
const producer_1 = require("../utils/Kafka/producer");
const logger_1 = __importDefault(require("../utils/logger"));
class QuestionBankController {
    static getTestQuestions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { limitS, limitM, categoryS, categoryM } = req.query || 10;
                if (!(categoryM || categoryS)) {
                    throw new Error('Category IDs are required');
                }
                logger_1.default.info(`Fetching questions for categories single: ${categoryS} and categories multiple: ${categoryM}`);
                yield (0, producer_1.sendMessage)('question-fetch', {
                    categoryS: categoryS === null || categoryS === void 0 ? void 0 : categoryS.toString(),
                    limitS: Number(limitS),
                    categoryM: categoryM === null || categoryM === void 0 ? void 0 : categoryM.toString(),
                    limitM: Number(limitM),
                    userId: parseInt(req.authUser)
                });
                // const parsedCategoryIds = categoryIds.toString().split(',').map((id) => Number(id));        
                // const questions = await QuestionBankService.getPracticeQuestions(parsedCategoryIds, Number(limit));
                res.status(202).json({ success: true, message: "Request Queued..." });
            }
            catch (error) {
                res.status(404).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
            }
        });
    }
    static getQuestionsByIds(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { ids } = req.query;
                if (!ids) {
                    throw new Error('Question IDs are required');
                }
                const parsedIds = ids.toString().split(',').map((id) => Number(id));
                logger_1.default.info(`Fetching questions for IDs: ${parsedIds}`);
                const questions = yield questionBankService_1.QuestionBankService.getQuestionByIds(parsedIds);
                logger_1.default.info(`Questions: ${JSON.stringify(questions)}`);
                res.status(200).json({ success: true, data: questions });
            }
            catch (error) {
                res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
            }
        });
    }
    static getAllQuestions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId } = req.query;
                const questions = yield questionBankService_1.QuestionBankService.getAllQuestions(Number(categoryId));
                res.status(200).json({ success: true, data: questions });
            }
            catch (error) {
                res.status(404).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
            }
        });
    }
    static getPracticeQuestions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { categoryId, limit } = req.query;
                if (!categoryId)
                    throw new Error('Category ID is required');
                const parsedCategoryId = Number(categoryId);
                if (isNaN(parsedCategoryId))
                    throw new Error('Invalid Category ID');
                logger_1.default.info(`Fetching practice questions for category: ${parsedCategoryId}`);
                const questions = yield questionBankService_1.QuestionBankService.getPracticeQuestions(parsedCategoryId, Number(limit));
                res.status(200).json({ success: true, data: questions });
            }
            catch (error) {
                res.status(404).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
            }
        });
    }
    static submitQuestions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { submissions, markingScheme } = req.body;
                if (!submissions || !Array.isArray(submissions)) {
                    throw new Error('Submissions are required');
                }
                logger_1.default.info(`Submitting questions for user: ${req.authUser}`);
                yield (0, producer_1.sendMessage)('question-submit', {
                    submissions,
                    markingScheme,
                    userId: parseInt(req.authUser)
                });
                res.status(202).json({ success: true, message: "Request Queued..." });
            }
            catch (error) {
                res.status(404).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
            }
        });
    }
    static getQuestionById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    throw new Error('Question ID is required');
                }
                const question = yield questionBankService_1.QuestionBankService.getQuestionById(Number(id));
                res.status(200).json({ success: true, data: question });
            }
            catch (error) {
                res.status(404).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
            }
        });
    }
    static createQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { question, answer, options, categoryId, creatorName, explaination, multipleCorrectType, pyq, year, rating } = req.body;
                if (!question || !answer || !options || !categoryId || !creatorName || !explaination) {
                    throw new Error('All fields (question, answer, options, categoryId, creatorName, explaination) are required');
                }
                const newQuestion = yield questionBankService_1.QuestionBankService.createQuestion({ question, answer, options, categoryId, creatorName, explaination, multipleCorrectType, pyq, year, rating });
                res.status(201).json({ success: true, data: newQuestion });
            }
            catch (error) {
                res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
            }
        });
    }
    static updateQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const data = req.body;
                if (!id) {
                    throw new Error('Question ID is required');
                }
                const updatedQuestion = yield questionBankService_1.QuestionBankService.updateQuestion(Number(id), data);
                res.status(200).json({ success: true, data: updatedQuestion });
            }
            catch (error) {
                res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
            }
        });
    }
    static deleteQuestion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    throw new Error('Question ID is required');
                }
                yield questionBankService_1.QuestionBankService.deleteQuestion(Number(id));
                res.status(200).json({ success: true, message: 'Question deleted successfully' });
            }
            catch (error) {
                res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
            }
        });
    }
}
exports.default = QuestionBankController;
