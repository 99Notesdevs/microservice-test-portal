import { QuestionBankRepository } from "../repositories/questionBankRepository";
import CategoryService from "./categoryService";

export class QuestionBankService {

    static async getTestQuestions(categoryIds: number[], limit: number) {
        // Refine category ids -- returns an array of numbers
        const categories = await CategoryService.getCategoriesByIds(categoryIds) as {id: number, name: string}[];
        // Make the limits per category
        const limitPerCategory = limit > categories.length ? Math.floor(limit / categories.length) : 1;
        
        // Get questions for each category
        const questions = await Promise.all(
            categories.map(async (category) => {
                const questions = await QuestionBankRepository.getQuestionsByCategoryId(category.id, limitPerCategory);
                return questions;
            })
        );
        return questions.flat();
    }

    static async getPracticeQuestions(categoryId: number, limit: number) {
        const questions = await QuestionBankRepository.getPracticeQuestionsByCategoryId(categoryId, limit);
        return questions;
    }

    static async getQuestionsByCategoryId(categoryId: number, limit: number) {
        const questions = await QuestionBankRepository.getQuestionsByCategoryId(categoryId, limit);
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
    }) {
        const question = await QuestionBankRepository.createQuestion(data);
        return question;
    }

    static async updateQuestion(questionId: number, data: Partial<{
        question: string;
        answer: string;
        options: string[];
        categoryId: number;
    }>) {
        const question = await QuestionBankRepository.updateQuestion(questionId, data);
        return question;
    }

    static async deleteQuestion(questionId: number) {
        const question = await QuestionBankRepository.deleteQuestion(questionId);
        return question;
    }
}