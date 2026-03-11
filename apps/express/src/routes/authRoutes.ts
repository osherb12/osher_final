import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { validate } from '../middleware/validate.js';
import { LoginSchema, RegisterSchema } from '@osher/shared';
import { auth } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();

router.post('/register', validate(z.object({ body: RegisterSchema })), AuthController.register);
router.post('/login', validate(z.object({ body: LoginSchema })), AuthController.login);
router.get('/profile', auth, AuthController.getProfile);

export default router;
