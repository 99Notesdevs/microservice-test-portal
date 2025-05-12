import { Router } from 'express';
import QuestionBankController from '../controllers/QuestionBankController';
import { authenticate } from '../middlewares/authenticate';
import { authorizeRoles } from '../middlewares/authorizeRoles';

const questionRouter = Router();

questionRouter.use(authenticate);

// Query: /practice?limit=x&categoryIds=y,z,v
questionRouter.get('/practice', authorizeRoles(["Admin", "User"]), QuestionBankController.getPracticeQuestions);

// Params: /:id
questionRouter.get('/:id', authorizeRoles(["Admin", "User"]), QuestionBankController.getQuestionById);

// Body: { question: string, answer: string, options: string[], categoryId: number }
questionRouter.post('/', authorizeRoles(["Admin"]), QuestionBankController.createQuestion);

// Params: /:id
// Body: Partial<{ question: string, answer: string, options: string[], categoryId: number }>
questionRouter.put('/:id', authorizeRoles(["Admin"]), QuestionBankController.updateQuestion);

// Params: /:id
questionRouter.delete('/:id', authorizeRoles(["Admin"]), QuestionBankController.deleteQuestion);

export default questionRouter;