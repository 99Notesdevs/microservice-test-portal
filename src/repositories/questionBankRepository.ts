import { prisma } from "../config/prisma";

export class QuestionBankRepository {
    static async getQuestionsByCategoryId(categoryId: number, limit: number, multiplechoice: number) {
        const questions = await prisma.$queryRawUnsafe(
            `
                SELECT * FROM "QuestionBank"
                WHERE "categoryId" = ($1) AND "multipleCorrectType" = ($3)
                ORDER BY random()
                LIMIT ($2)
            `, categoryId, limit, !!multiplechoice);
        return questions;
    }

    static async getPracticeQuestionsByCategoryId(categoryId: number, limit: number) {
        const questions = await prisma.questionBank.findMany({
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

    static async getAllQuestions(categoryId: number) {
        const questions = await prisma.questionBank.findMany({
            where: {
                categories: {
                    id: categoryId,
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return questions;
    }

    static async createQuestion(data: {
        question: string;
        answer: string;
        options: string[];
        categoryId: number;
        creatorName: string;
        explaination: string;
        multipleCorrectType: boolean;
        pyq: boolean;
        year: number | null;
        acceptance: number | null;
    }) {
        const question = await prisma.questionBank.create({
            data: {
                question: data.question,
                answer: data.answer,
                options: data.options,
                categories: {
                    connect: { id: data.categoryId }, // Connect to the related category
                },
                creatorName: data.creatorName,
                explaination: data.explaination,
                multipleCorrectType: data.multipleCorrectType,
                pyq: data.pyq,
                year: data.year,
                acceptance: data.acceptance,
            },
        });
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
        pyq: boolean;
        year: number | null;
        acceptance: number | null;
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
                creatorName: data.creatorName,
                explaination: data.explaination,
                multipleCorrectType: data.multipleCorrectType,
                pyq: data.pyq,
                year: data.year,
                acceptance: data.acceptance,
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