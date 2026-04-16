import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import * as categoryController from '../controllers/category.controller.js';
import {
  createCategorySchema,
  updateCategorySchema,
} from '../validators/category.schema.js';

const router = Router();

router.use(auth);

router.get('/', categoryController.list);
router.post('/', validate(createCategorySchema), categoryController.create);
router.put('/:id', validate(updateCategorySchema), categoryController.update);
router.delete('/:id', categoryController.remove);

export default router;
