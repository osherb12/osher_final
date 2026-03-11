import { Router } from 'express';
import { ContactController } from '../controllers/ContactController.js';
import { auth, admin } from '../middleware/auth.js';

const router = Router();

// Public: Submit inquiry
router.post('/', ContactController.submit);

// Admin: View all inquiries
router.get('/', auth, admin, ContactController.getAll);

export default router;
