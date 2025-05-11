import { Router } from 'express';
import QuestionBankController from '../controllers/QuestionBankController';

const questionRouter = Router();

// /practice?limit=x
// body --> { categoryIds: number[] }
questionRouter.get('/practice', QuestionBankController.getPracticeQuestions);


export default questionRouter;