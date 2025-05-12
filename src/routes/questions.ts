import { Router } from 'express';
import QuestionBankController from '../controllers/QuestionBankController';

const questionRouter = Router();

// Query: /practice?limit=x&categoryIds=y,z,v
questionRouter.get('/practice', QuestionBankController.getPracticeQuestions);

// Params: /:id
questionRouter.get('/:id', QuestionBankController.getQuestionById);

// Body: { question: string, answer: string, options: string[], categoryId: number }
questionRouter.post('/', QuestionBankController.createQuestion);

// Params: /:id
// Body: Partial<{ question: string, answer: string, options: string[], categoryId: number }>
questionRouter.put('/:id', QuestionBankController.updateQuestion);

// Params: /:id
questionRouter.delete('/:id', QuestionBankController.deleteQuestion);

export default questionRouter;