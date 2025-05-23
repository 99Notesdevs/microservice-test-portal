import { QuestionBankRepository } from "../repositories/questionBankRepository";
import logger from "../utils/logger";
import CategoryService from "./categoryService";

export class QuestionBankService {

    static async getTestQuestions(categoryIds: number[], limit: number, multiplechoice: number) {
        // Refine category ids -- returns an array of numbers
        const categories = await CategoryService.getCategoriesByIds(categoryIds) as {id: number, name: string}[];
        // Make the limits per category
        const limitPerCategory = limit > categories.length ? Math.ceil(limit / categories.length) : 1;
        
        // Get questions for each category
        const questions = await Promise.all(
            categories.map(async (category) => {
                const questions = await QuestionBankRepository.getQuestionsByCategoryId(category.id, limitPerCategory, multiplechoice);
                return questions;
            })
        );
        return questions.flat().slice(0, limit);
    }

    static async getAllQuestions(categoryId: number) {
        const questions = await QuestionBankRepository.getAllQuestions(categoryId);
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
        categoryId: number;
        creatorName: string;
        explaination: string;
        multipleCorrectType: boolean;
    }) {
        const question = await QuestionBankRepository.createQuestion(data);
        return question;
    }

    static async updateQuestion(questionId: number, data: Partial<{
        question: string;
        answer: string;
        options: string[];
        categoryId: number;
        creatorName: string;
        explaination: string;
        multipleCorrectType: boolean;
    }>) {
        const question = await QuestionBankRepository.updateQuestion(questionId, data);
        return question;
    }

    static async deleteQuestion(questionId: number) {
        const question = await QuestionBankRepository.deleteQuestion(questionId);
        return question;
    }
}