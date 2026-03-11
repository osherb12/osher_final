import { Router, Request, Response, NextFunction } from 'express';
import { OrderController } from '../controllers/OrderController.js';
import { validate } from '../middleware/validate.js';
import { auth, admin } from '../middleware/auth.js';
import { OrderSchema } from '@osher/shared';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { JWT_SECRET } from '../config.js';

const router = Router();

// Optional auth for guest checkout
const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    next();
  }
};

const bodySchema = z.object({ body: OrderSchema });

router.post('/', optionalAuth, validate(bodySchema), OrderController.create);
router.get('/my-orders', optionalAuth, (req, res, next) => {
  if (!(req as any).user) return res.status(401).json({ success: false, error: 'Unauthorized' });
  next();
}, OrderController.getByUserId);

// Admin Routes
router.get('/', auth, admin, OrderController.getAll);
router.get('/stats', auth, admin, OrderController.getStats);
router.put('/:id/status', auth, admin, OrderController.updateStatus);
router.put('/:id/cancel', auth, OrderController.cancelOrder);

router.get('/:id', optionalAuth, OrderController.getById);

export default router;
