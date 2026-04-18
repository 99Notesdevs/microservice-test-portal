import { QuestionBankRepository } from "../repositories/questionBankRepository";
import { ExamRepository } from "../repositories/examRepository";
import logger from "../utils/logger";
import CategoryService from "./categoryService";

export class QuestionBankService {

    static async getTestQuestions(categoryIds: number[], limit: number, multiplechoice: number) {
        // Refine category ids -- returns an array of numbers
        const categories = await CategoryService.getCategoriesByIds(categoryIds) as {id: number, name: string}[];
        const refinedCategoryIds = categories.map((category) => category.id);

        // Fetch once across all selected categories to avoid duplicate questions
        // when a question belongs to multiple selected categories.
        const questions = await QuestionBankRepository.getQuestionsByCategoryId(
            refinedCategoryIds,
            limit,
            multiplechoice,
        );
        return questions;
    }

    static async getAllQuestions(categoryIds: number[], limit: number = 5) {
        const questions = await QuestionBankRepository.getAllQuestions(categoryIds, limit);
        return questions;
    }

    static async getRandomQuestions(limit: number) {
        const questions = await QuestionBankRepository.getRandomQuestions(limit);
        return questions;
    }

    static async getQuestionByIds(parsedIds: number[]) {
        let result = {}
        for(const id of parsedIds) {
            const question = await QuestionBankRepository.getQuestionById(id);
            result = {...result, [`${id}`]: question}
        }
        logger.info(`Done fetching...`);
        return result;
    }

    static async getPracticeQuestions(categoryId: number, limit: number) {
        const questions = await QuestionBankRepository.getPracticeQuestionsByCategoryId(categoryId, limit);
        return questions;
    }

    static async getQuestionById(questionId: number) {
        const question = await QuestionBankRepository.getQuestionById(questionId);
        return question;
    }

    static async createQuestion(data: {
        question: string;
        answer: string;
        options: string[];
        categoryIds: number[];
        creatorName: string;
        explaination: string;
        multipleCorrectType: boolean;
        pyq: boolean;
        year: number | null;
        rating: number | null;
        completed?: boolean;
        examId?: number | null;
        examName?: string | null;
        isCurrentAffair?: boolean;
        currentAffairArticleId?: number | null;
    }) {
        let examId = data.examId ?? null;
        if (!examId && data.examName) {
            const exam = await ExamRepository.findOrCreateByName(data.examName);
            examId = exam.id;
        }
        const question = await QuestionBankRepository.createQuestion({ ...data, examId });
        return question;
    }

    static async updateQuestion(questionId: number, data: Partial<{
        question: string;
        answer: string;
        options: string[];
        categoryIds: number[];
        creatorName: string;
        explaination: string;
        multipleCorrectType: boolean;
        pyq: boolean;
        year: number | null;
        rating: number | null;
        completed: boolean;
        examId?: number | null;
        examName?: string | null;
        isCurrentAffair?: boolean;
        currentAffairArticleId?: number | null;
    }>) {
        let examId = (data as any).examId ?? null;
        if (!examId && (data as any).examName) {
            const exam = await ExamRepository.findOrCreateByName((data as any).examName);
            examId = exam.id;
        }
        const payload = { ...data, examId } as any;
        const question = await QuestionBankRepository.updateQuestion(questionId, payload);
        return question;
    }

    static async deleteQuestion(questionId: number) {
        const question = await QuestionBankRepository.deleteQuestion(questionId);
        return question;
    }
}