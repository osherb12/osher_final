import { Request, Response } from 'express';
import { UserModel } from '../models/User.js';
import { ProductModel } from '../models/Product.js';
import { ApiResponse, CartItem } from '@osher/shared';

export class UserController {
  // Profile Methods
  public static async getProfile(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const user = await UserModel.findById((req as any).user.id).select('-password');
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });
      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async updateProfile(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const { name, bio, phoneNumber, address, avatar } = req.body;
      const user = await UserModel.findById((req as any).user.id);
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });

      if (name) user.name = name;
      if (bio !== undefined) user.bio = bio;
      if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
      if (address) user.address = { ...user.address, ...address };
      if (avatar !== undefined) user.avatar = avatar;

      await user.save();
      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Cart Methods
  public static async getCart(req: Request, res: Response<ApiResponse<CartItem[]>>) {
    try {
      const user = await UserModel.findById((req as any).user.id);
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });
      res.json({ success: true, data: user.cart as any });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async addToCart(req: Request, res: Response<ApiResponse<CartItem[]>>) {
    try {
      const { productId, quantity = 1 }: CartItem = req.body;
      const user = await UserModel.findById((req as any).user.id);
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });

      // Backend stock check
      const product = await ProductModel.findById(productId);
      if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

      const existingIndex = user.cart.findIndex(item => item.productId === productId);
      
      if (existingIndex !== -1) {
        const newQuantity = user.cart[existingIndex].quantity + quantity;
        
        if (newQuantity > product.stock && quantity > 0) {
          return res.status(400).json({ success: false, error: `Only ${product.stock} units available` });
        }

        if (newQuantity <= 0) {
          user.cart.splice(existingIndex, 1);
        } else {
          user.cart[existingIndex].quantity = newQuantity;
        }
      } else {
        if (quantity > product.stock) {
          return res.status(400).json({ success: false, error: `Only ${product.stock} units available` });
        }
        if (quantity > 0) {
          user.cart.push({ productId, quantity });
        }
      }

      await user.save();
      res.json({ success: true, data: user.cart as any });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async removeFromCart(req: Request, res: Response<ApiResponse<CartItem[]>>) {
    try {
      const { productId } = req.params;
      const user = await UserModel.findById((req as any).user.id);
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });

      user.cart = user.cart.filter(item => item.productId !== productId) as any;
      await user.save();
      res.json({ success: true, data: user.cart as any });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async clearCart(req: Request, res: Response<ApiResponse<null>>) {
    try {
      const user = await UserModel.findById((req as any).user.id);
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });

      user.cart = [];
      await user.save();
      res.json({ success: true, message: 'Cart cleared' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Wishlist Methods
  public static async getWishlist(req: Request, res: Response<ApiResponse<string[]>>) {
    try {
      const user = await UserModel.findById((req as any).user.id);
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });
      res.json({ success: true, data: user.wishlist });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async addToWishlist(req: Request, res: Response<ApiResponse<string[]>>) {
    try {
      const { productId } = req.body;
      const user = await UserModel.findById((req as any).user.id);
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });

      if (!user.wishlist.includes(productId)) {
        user.wishlist.push(productId);
        await user.save();
      }
      res.json({ success: true, data: user.wishlist });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async removeFromWishlist(req: Request, res: Response<ApiResponse<string[]>>) {
    try {
      const { productId } = req.params;
      const user = await UserModel.findById((req as any).user.id);
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });

      user.wishlist = user.wishlist.filter(id => id !== productId);
      await user.save();
      res.json({ success: true, data: user.wishlist });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
