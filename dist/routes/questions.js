"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const QuestionBankController_1 = __importDefault(require("../controllers/QuestionBankController"));
const authenticate_1 = require("../middlewares/authenticate");
const authorizeRoles_1 = require("../middlewares/authorizeRoles");
const questionRouter = (0, express_1.Router)();
// Query: /test?limitS=a&limitM=b&categoryS=x,y,z&categoryM=p,q,r
questionRouter.get('/test', authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(["Admin", "User"]), QuestionBankController_1.default.getTestQuestions);
// Query: /practice?categoryId=x
questionRouter.get('/practice', QuestionBankController_1.default.getPracticeQuestions);
// Query: /?categoryId=y
questionRouter.get('/', authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(["Admin", "User"]), QuestionBankController_1.default.getAllQuestions);
// Query: /ids?ids=x,y,z
questionRouter.get('/ids', authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(["Admin", "User"]), QuestionBankController_1.default.getQuestionsByIds);
// Params: /:id
questionRouter.get('/:id', authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(["Admin", "User"]), QuestionBankController_1.default.getQuestionById);
// Body: { question: string, answer: string, options: string[], categoryId: number }
questionRouter.post('/', authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(["Admin"]), QuestionBankController_1.default.createQuestion);
// Body: { submissions: Array<{ questionId: number, selectedOption: string }> }
questionRouter.post('/submit', authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(["Admin", "User"]), QuestionBankController_1.default.submitQuestions);
// Params: /:id
// Body: Partial<{ question: string, answer: string, options: string[], categoryId: number }>
questionRouter.put('/:id', authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(["Admin"]), QuestionBankController_1.default.updateQuestion);
// Params: /:id
questionRouter.delete('/:id', authenticate_1.authenticate, (0, authorizeRoles_1.authorizeRoles)(["Admin"]), QuestionBankController_1.default.deleteQuestion);
exports.default = questionRouter;
