import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import validate from '../middleware/validate.middleware.js';
import auth from '../middleware/auth.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.schema.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', auth, authController.me);
router.get('/demo', authController.demo);

export default router;
