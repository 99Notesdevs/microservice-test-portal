import { Router } from 'express';
import CategoriesController from '../controllers/Categories';
import { authenticate } from '../middlewares/authenticate';
import { authorizeRoles } from '../middlewares/authorizeRoles';

const categoryRouter = Router();

categoryRouter.get('/', authenticate, authorizeRoles(["Admin", "User"]), CategoriesController.getAllCategories);

// Params: /:id
categoryRouter.get('/:id', authenticate, authorizeRoles(["Admin", "User"]), CategoriesController.getCategoryById);

// Body: { name: string, parentTagId: number }
categoryRouter.post('/', authenticate, authorizeRoles(["Admin"]), CategoriesController.createCategory);

// Params: /:id
// Body: { name: string }
categoryRouter.put('/:id', authenticate, authorizeRoles(["Admin"]), CategoriesController.updateCategory);

// Params: /:id
categoryRouter.delete('/:id', authenticate, authorizeRoles(["Admin"]), CategoriesController.deleteCategory);

export default categoryRouter;