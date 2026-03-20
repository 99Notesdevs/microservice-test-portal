import { prisma } from "../config/prisma";
import logger from "../utils/logger";

export class QuestionBankRepository {
    static async getQuestionsByCategoryId(categoryIds: number[], limit: number, multiplechoice: number) {
        logger.info("getQuestionsByCategoryId called", { categoryIds, limit, multiplechoice });
        const categoryIdsCsv = categoryIds.join(',');
        const questions = await prisma.$queryRawUnsafe(
            `
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
        logger.info("getQuestionsByCategoryId result", { length: (questions as any[]).length });
        return questions;
    }

    static async getPracticeQuestionsByCategoryId(categoryId: number, limit: number) {
        logger.info("getPracticeQuestionsByCategoryId called", { categoryId, limit });
        const questions = await prisma.$queryRawUnsafe(
            `
                SELECT qb.*, COALESCE(json_agg(json_build_object('id', c.id, 'name', c.name)) FILTER (WHERE c.id IS NOT NULL), '[]') as categories
                FROM "QuestionBank" qb
                LEFT JOIN "_CategoryToQuestionBank" tqb ON qb.id = tqb."B"
                LEFT JOIN "Categories" c ON c.id = tqb."A"
                WHERE qb."pyq" = true AND EXISTS (
                  SELECT 1 FROM "_CategoryToQuestionBank" t2 WHERE t2."B" = qb.id AND t2."A" = ($1)
                )
                GROUP BY qb.id
                ORDER BY qb."createdAt" DESC
                LIMIT ($2)
            `, categoryId, limit
        );
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
                categories: true,
                exam: true,
            },
        });
        logger.info("getQuestionById result", { found: !!question });
        return question;
    }

    static async getAllQuestions(categoryIds: number[]) {
        logger.info("getAllQuestions called", { categoryIds });
        const categoryIdsCsv = categoryIds.join(',');
        const requiredCategoryCount = categoryIds.length;

        const questions = await prisma.$queryRawUnsafe(
            `
                SELECT qb.*, COALESCE(json_agg(json_build_object('id', c.id, 'name', c.name)) FILTER (WHERE c.id IS NOT NULL), '[]') as categories
                FROM "QuestionBank" qb
                LEFT JOIN "_CategoryToQuestionBank" tqb ON qb.id = tqb."B"
                LEFT JOIN "Categories" c ON c.id = tqb."A"
                WHERE qb.id IN (
                  SELECT t2."B"
                  FROM "_CategoryToQuestionBank" t2
                  WHERE t2."A" = ANY (string_to_array($1, ',')::int[])
                  GROUP BY t2."B"
                  HAVING COUNT(DISTINCT t2."A") = $2
                )
                GROUP BY qb.id
                ORDER BY qb."createdAt" DESC
            `,
            categoryIdsCsv,
            requiredCategoryCount
        );
        logger.info("getAllQuestions result", { length: (questions as any[]).length });
        return questions;
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
    }) {
        logger.info("createQuestion called", { ...data, optionsLength: data.options.length, categoryIdsLength: data.categoryIds.length });
        const question = await prisma.questionBank.create({
            data: {
                question: data.question,
                answer: data.answer,
                options: data.options,
                categories: {
                    connect: data.categoryIds.map(id => ({ id: Number(id) })),
                } as any,
                creatorName: data.creatorName,
                explaination: data.explaination,
                multipleCorrectType: data.multipleCorrectType,
                pyq: data.pyq,
                year: data.year,
                rating: data.rating,
                ...(typeof data.completed === 'boolean' ? { completed: data.completed } : {}),
                examId: data.examId ?? undefined,
            },
            include: { exam: true },
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
        categoryIds: number[];
        creatorName: string;
        explaination: string;
        multipleCorrectType: boolean;
        pyq: boolean;
        year: number | null;
        rating: number | null;
        completed: boolean;
        examId?: number | null;
    }>) {
        logger.info("updateQuestion called", { questionId, ...data, optionsLength: data.options?.length, categoryIdsLength: data.categoryIds?.length });
        const question = await prisma.questionBank.update({
            where: {
                id: questionId,
            },
            data: {
                question: data.question,
                answer: data.answer,
                options: data.options,
                ...(data.categoryIds && data.categoryIds.length > 0 && {
                    categories: {
                        set: data.categoryIds.map(id => ({ id: Number(id) })),
                    } as any,
                }),
                creatorName: data.creatorName,
                explaination: data.explaination,
                multipleCorrectType: data.multipleCorrectType,
                pyq: data.pyq,
                year: data.year,
                rating: data.rating,
                ...(typeof data.completed === 'boolean' ? { completed: data.completed } : {}),
                ...(data.hasOwnProperty('examId') ? { examId: (data as any).examId } : {}),
            },
            include: { exam: true },
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