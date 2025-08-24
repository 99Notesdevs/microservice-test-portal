import { Request, Response } from 'express';
import { QuestionBankService } from '../services/questionBankService';
import { sendMessage } from '../utils/Kafka/producer';
import logger from '../utils/logger';

export default class QuestionBankController {
    static async getTestQuestions(req: Request, res: Response) {
        try {
            const { limitS, limitM, categoryS, categoryM } = req.query || 10;
            if (!(categoryM || categoryS)) {
                throw new Error('Category IDs are required');
            }
            logger.info(`Fetching questions for categories single: ${categoryS} and categories multiple: ${categoryM}`);
            await sendMessage('question-fetch', {
                categoryS: categoryS?.toString(),
                limitS: Number(limitS),
                categoryM: categoryM?.toString(),
                limitM: Number(limitM),
                userId: parseInt(req.authUser!)
            });
            // const parsedCategoryIds = categoryIds.toString().split(',').map((id) => Number(id));        
            // const questions = await QuestionBankService.getPracticeQuestions(parsedCategoryIds, Number(limit));
            res.status(202).json({ success: true, message: "Request Queued..." });
        } catch (error: unknown) {
            res.status(404).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
        }
    }

    static async getQuestionsByIds(req: Request, res: Response) {
        try {
            const { ids } = req.query;
            if (!ids) {
                throw new Error('Question IDs are required');
            }
            const parsedIds = ids.toString().split(',').map((id) => Number(id));
            logger.info(`Fetching questions for IDs: ${parsedIds}`);
            const questions = await QuestionBankService.getQuestionByIds(parsedIds);
            logger.info(`Questions: ${JSON.stringify(questions)}`);
            res.status(200).json({ success: true, data: questions });
        } catch(error: unknown) {
            res.status(404).json({ success: false, message: error instanceof Error ? error.message : "Internal Server Error" });
        }
    }

    static async getAllQuestions(req: Request, res: Response) {
        try {
            const { categoryId } = req.query;
            const questions = await QuestionBankService.getAllQuestions(Number(categoryId));
            res.status(200).json({ success: true, data: questions });
        } catch (error: unknown) {
            res.status(404).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
        }
    }

    static async getPracticeQuestions(req: Request, res: Response) {
        try {
            const { categoryId, limit } = req.query;
            if(!categoryId) throw new Error('Category ID is required');
            const parsedCategoryId = Number(categoryId);
            if (isNaN(parsedCategoryId)) throw new Error('Invalid Category ID');
            logger.info(`Fetching practice questions for category: ${parsedCategoryId}`);
            const questions = await QuestionBankService.getPracticeQuestions(parsedCategoryId, Number(limit));
            res.status(200).json({ success: true, data: questions });
        } catch (error: unknown) {
            res.status(404).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
        }
    }

    static async submitQuestions(req: Request, res: Response) {
        try {
            const { submissions, markingScheme } = req.body;
            if (!submissions || !Array.isArray(submissions)) {
                throw new Error('Submissions are required');
            }
            logger.info(`Submitting questions for user: ${req.authUser}`);
            await sendMessage('question-submit', {
                submissions,
                markingScheme,
                userId: parseInt(req.authUser!)
            });
            res.status(202).json({ success: true, message: "Request Queued..." });
        } catch (error: unknown) {
            res.status(404).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
        }
    }

    static async getQuestionById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new Error('Question ID is required');
            }
            const question = await QuestionBankService.getQuestionById(Number(id));
            res.status(200).json({ success: true, data: question });
        } catch (error: unknown) {
            res.status(404).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
        }
    }

    static async createQuestion(req: Request, res: Response) {
        try {
            const { question, answer, options, categoryId, creatorName, explaination, multipleCorrectType, pyq, year, rating } = req.body;
            if (!question || !answer || !options || !categoryId || !creatorName || !explaination) {
                throw new Error('All fields (question, answer, options, categoryId, creatorName, explaination) are required');
            }
            const newQuestion = await QuestionBankService.createQuestion({ question, answer, options, categoryId, creatorName, explaination, multipleCorrectType, pyq, year, rating });
            res.status(201).json({ success: true, data: newQuestion });
        } catch (error: unknown) {
            res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
        }
    }

    static async updateQuestion(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const data = req.body;
            if (!id) {
                throw new Error('Question ID is required');
            }
            const updatedQuestion = await QuestionBankService.updateQuestion(Number(id), data);
            res.status(200).json({ success: true, data: updatedQuestion });
        } catch (error: unknown) {
            res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
        }
    }

    static async deleteQuestion(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                throw new Error('Question ID is required');
            }
            await QuestionBankService.deleteQuestion(Number(id));
            res.status(200).json({ success: true, message: 'Question deleted successfully' });
        } catch (error: unknown) {
            res.status(400).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
        }
    }
}