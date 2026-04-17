import { Router } from 'express';
import auth from '../middleware/auth.middleware.js';
import * as dashboardController from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/', auth, dashboardController.getDashboard);

export default router;
