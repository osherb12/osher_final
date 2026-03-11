import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController.js';
import { auth, admin } from '../middleware/auth.js';

const router = Router();

router.get('/', CategoryController.getAll);
router.post('/', auth, admin, CategoryController.create);
router.delete('/:id', auth, admin, CategoryController.delete);

export default router;
