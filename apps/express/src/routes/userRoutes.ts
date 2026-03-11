import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

// Profile
router.get('/profile', auth, UserController.getProfile);
router.put('/profile', auth, UserController.updateProfile);

// Cart
router.get('/cart', auth, UserController.getCart);
router.post('/cart', auth, UserController.addToCart);
router.delete('/cart/:productId', auth, UserController.removeFromCart);
router.delete('/cart', auth, UserController.clearCart);

// Wishlist
router.get('/wishlist', auth, UserController.getWishlist);
router.post('/wishlist', auth, UserController.addToWishlist);
router.delete('/wishlist/:productId', auth, UserController.removeFromWishlist);

export default router;
