import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import * as devController from '../controllers/dev.controller.js';

const router = Router();

router.use(auth);

router.post('/seed', devController.seed);
router.post('/wipe', devController.wipe);

export default router;
