import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import * as habitController from '../controllers/habit.controller.js';
import { createHabitSchema, updateHabitSchema } from '../validators/habit.schema.js';

const router = Router();

router.use(auth);

router.get('/', habitController.list);
router.get('/:id', habitController.getById);
router.get('/:id/calendar', habitController.getCalendar);
router.post('/', validate(createHabitSchema), habitController.create);
router.put('/:id', validate(updateHabitSchema), habitController.update);
router.delete('/:id', habitController.remove);
router.post('/:id/toggle', habitController.toggleLog);

export default router;
