import { Router } from 'express';
import CategoriesController from '../controllers/Categories';

const categoryRouter = Router();

categoryRouter.get('/', CategoriesController.getAllCategories);

// Params: /:id
categoryRouter.get('/:id', CategoriesController.getCategoryById);

// Body: { name: string, parentTagId: number }
categoryRouter.post('/', CategoriesController.createCategory);

// Params: /:id
// Body: { name: string }
categoryRouter.put('/:id', CategoriesController.updateCategory);

// Params: /:id
categoryRouter.delete('/:id', CategoriesController.deleteCategory);

export default categoryRouter;