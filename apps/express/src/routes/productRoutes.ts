import { Router } from 'express';
import { ProductController } from '../controllers/ProductController.js';
import { validate } from '../middleware/validate.js';
import { auth, admin } from '../middleware/auth.js';
import { ProductSchema } from '@osher/shared';
import { z } from 'zod';

const router = Router();

// Zod schema for validation wrapper
const bodySchema = z.object({ body: ProductSchema });

router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);
router.post('/:id/reviews', auth, ProductController.addReview);

// Admin-only routes
router.post('/', auth, admin, validate(bodySchema), ProductController.create);
router.put('/:id', auth, admin, validate(z.object({ body: ProductSchema.partial() })), ProductController.update);
router.delete('/:id', auth, admin, ProductController.delete);

export default router;
