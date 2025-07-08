import { prisma } from "../config/prisma";
import logger from "../utils/logger";

export class QuestionBankRepository {
    static async getQuestionsByCategoryId(categoryId: number, limit: number, multiplechoice: number) {
        logger.info("getQuestionsByCategoryId called", { categoryId, limit, multiplechoice });
        const questions = await prisma.$queryRawUnsafe(
            `
                SELECT * FROM "QuestionBank"
                WHERE "categoryId" = ($1) AND "multipleCorrectType" = ($3)
                ORDER BY random()
                LIMIT ($2)
            `, categoryId, limit, !!multiplechoice);
        logger.info("getQuestionsByCategoryId result", { length: (questions as any[]).length });
        return questions;
    }

    static async getPracticeQuestionsByCategoryId(categoryId: number, limit: number) {
        logger.info("getPracticeQuestionsByCategoryId called", { categoryId, limit });
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
        logger.info("getPracticeQuestionsByCategoryId result", { length: (questions as any[]).length });
        return questions;
    }

    static async getQuestionById(questionId: number) {
        logger.info("getQuestionById called", { questionId });
        const question = await prisma.questionBank.findUnique({
            where: {
                id: questionId,
            },
            include: {
                categories: true, // Include related category data
            },
        });
        logger.info("getQuestionById result", { found: !!question });
        return question;
    }

    static async getAllQuestions(categoryId: number) {
        logger.info("getAllQuestions called", { categoryId });
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
        logger.info("getAllQuestions result", { length: (questions as any[]).length });
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
        rating: number | null;
    }) {
        logger.info("createQuestion called", { ...data, optionsLength: data.options.length });
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
                rating: data.rating,
            },
        });
        logger.info("createQuestion result", { id: question.id });
        return question;
    }

    static async updateQuestionAttempts(questionId: number, correct: number) {
        logger.info("updateQuestionAttempts called", { questionId, correct });
        const question = await prisma.questionBank.update({
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
        logger.info("updateQuestionAttempts result", { id: question.id });
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
        rating: number | null;
    }>) {
        logger.info("updateQuestion called", { questionId, ...data, optionsLength: data.options?.length });
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
                rating: data.rating
            },
        });
        logger.info("updateQuestion result", { id: question.id });
        return question;
    }

    static async deleteQuestion(questionId: number) {
        logger.info("deleteQuestion called", { questionId });
        const question = await prisma.questionBank.delete({
            where: {
                id: questionId,
            },
        });
        logger.info("deleteQuestion result", { id: question.id });
        return question;
    }
}