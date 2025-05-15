import { Router } from 'express';
import QuestionBankController from '../controllers/QuestionBankController';
import { authenticate } from '../middlewares/authenticate';
import { authorizeRoles } from '../middlewares/authorizeRoles';

const questionRouter = Router();

// Query: /test?limit=x&categoryIds=y,z,v
questionRouter.get('/test', authenticate, authorizeRoles(["Admin", "User"]), QuestionBankController.getTestQuestions);

// Query: /practice?categoryId=x
questionRouter.get('/practice', QuestionBankController.getPracticeQuestions);

// Params: /:id
questionRouter.get('/:id', authenticate, authorizeRoles(["Admin", "User"]), QuestionBankController.getQuestionById);

// Body: { question: string, answer: string, options: string[], categoryId: number }
questionRouter.post('/', authenticate, authorizeRoles(["Admin"]), QuestionBankController.createQuestion);

// Body: { submissions: Array<{ questionId: number, selectedOption: string }> }
questionRouter.post('/submit', authenticate, authorizeRoles(["Admin", "User"]), QuestionBankController.submitQuestions);

// Params: /:id
// Body: Partial<{ question: string, answer: string, options: string[], categoryId: number }>
questionRouter.put('/:id', authenticate, authorizeRoles(["Admin"]), QuestionBankController.updateQuestion);

// Params: /:id
questionRouter.delete('/:id', authenticate, authorizeRoles(["Admin"]), QuestionBankController.deleteQuestion);

export default questionRouter;