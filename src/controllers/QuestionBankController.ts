import { Request, Response } from 'express';
import { QuestionBankService } from '../services/questionBankService';

export default class QuestionBankController {
    static async getPracticeQuestions(req: Request, res: Response) {
        try {
            const { limit } = req.query || 10;
            const { categoryIds } = req.body;
            if (!categoryIds) {
                throw new Error('Category IDs are required');
            }
            const questions = await QuestionBankService.getPracticeQuestions(categoryIds, Number(limit));
            res.status(200).json(questions);
        } catch (error: unknown) {
            res.status(404).json({ success: false, message: error instanceof Error ? error.message : 'Internal Server Error' });
        }
    }
}