import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import * as goalController from '../controllers/goal.controller.js';
import {
  createGoalSchema,
  updateGoalSchema,
  createMilestoneSchema,
  updateMilestoneSchema,
} from '../validators/goal.schema.js';

const router = Router();

router.use(auth);

router.get('/', goalController.list);
router.get('/:id', goalController.getById);
router.post('/', validate(createGoalSchema), goalController.create);
router.put('/:id', validate(updateGoalSchema), goalController.update);
router.delete('/:id', goalController.remove);

router.post('/:id/milestones', validate(createMilestoneSchema), goalController.addMilestone);
router.put('/:id/milestones/:milestoneId', validate(updateMilestoneSchema), goalController.updateMilestone);
router.delete('/:id/milestones/:milestoneId', goalController.removeMilestone);

export default router;
