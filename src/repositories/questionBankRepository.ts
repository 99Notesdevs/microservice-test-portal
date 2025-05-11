import { prisma } from "../config/prisma";

export class QuestionBankRepository {
    static async getQuestionsByCategoryId(categoryId: number, limit: number) {
        const questions = await prisma.questionBank.findMany({
            where: {
                categories: {
                    id: categoryId, // Match the category ID
                },
            },
            include: {
                categories: true, // Include related category data
            },
            orderBy: {
                random: true, // Randomize the order of questions
            },
            take: limit
        });
        return questions;
    }

    static async getQuestionById(questionId: number) {
        const question = await prisma.questionBank.findUnique({
            where: {
                id: questionId,
            },
            include: {
                categories: true, // Include related category data
            },
        });
        return question;
    }

    static async createQuestion(data: {
        question: string;
        answer: string;
        options: string[];
        categoryId: number;
    }) {
        const question = await prisma.questionBank.create({
            data: {
                question: data.question,
                answer: data.answer,
                options: data.options,
                categories: {
                    connect: { id: data.categoryId }, // Connect to the related category
                },
            },
        });
        return question;
    }

    static async updateQuestion(questionId: number, data: Partial<{
        question: string;
        answer: string;
        options: string[];
        categoryId: number;
    }>) {
        const question = await prisma.questionBank.update({
            where: {
                id: questionId,
            },
            data: {
                question: data.question,
                answer: data.answer,
                options: data.options,
                ...(data.categoryId && {
                    categories: {
                        connect: { id: data.categoryId }, // Update the related category
                    },
                }),
            },
        });
        return question;
    }

    static async deleteQuestion(questionId: number) {
        const question = await prisma.questionBank.delete({
            where: {
                id: questionId,
            },
        });
        return question;
    }
}