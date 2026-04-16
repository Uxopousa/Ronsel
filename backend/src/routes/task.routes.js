import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import * as taskController from '../controllers/task.controller.js';
import { createTaskSchema, updateTaskSchema } from '../validators/task.schema.js';

const router = Router();

router.use(auth);

router.get('/', taskController.list);
router.get('/:id', taskController.getById);
router.post('/', validate(createTaskSchema), taskController.create);
router.put('/:id', validate(updateTaskSchema), taskController.update);
router.delete('/:id', taskController.remove);

export default router;
