import { Router } from 'express';
import CategoriesController from '../controllers/Categories';
import { authenticate } from '../middlewares/authenticate';
import { authorizeRoles } from '../middlewares/authorizeRoles';

const categoryRouter = Router();

categoryRouter.use(authenticate);

categoryRouter.get('/', authorizeRoles(["Admin", "User"]), CategoriesController.getAllCategories);

// Params: /:id
categoryRouter.get('/:id', authorizeRoles(["Admin", "User"]), CategoriesController.getCategoryById);

// Body: { name: string, parentTagId: number }
categoryRouter.post('/', authorizeRoles(["Admin"]), CategoriesController.createCategory);

// Params: /:id
// Body: { name: string }
categoryRouter.put('/:id', authorizeRoles(["Admin"]), CategoriesController.updateCategory);

// Params: /:id
categoryRouter.delete('/:id', authorizeRoles(["Admin"]), CategoriesController.deleteCategory);

export default categoryRouter;