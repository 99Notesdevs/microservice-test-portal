import { Router } from 'express';
import QuestionBankController from '../controllers/QuestionBankController';

const questionRouter = Router();

// Query: /practice?limit=x&categoryIds=y
questionRouter.get('/practice', QuestionBankController.getPracticeQuestions);

// Route to get a question by ID
// Params: /:id
questionRouter.get('/:id', QuestionBankController.getQuestionById);

// Route to create a new question
// Body: { question: string, answer: string, options: string[], categoryId: number }
questionRouter.post('/', QuestionBankController.createQuestion);

// Route to update an existing question
// Params: /:id
// Body: Partial<{ question: string, answer: string, options: string[], categoryId: number }>
questionRouter.put('/:id', QuestionBankController.updateQuestion);

// Route to delete a question by ID
// Params: /:id
questionRouter.delete('/:id', QuestionBankController.deleteQuestion);

export default questionRouter;