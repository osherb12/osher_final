import { Request, Response } from 'express';
import { ProductModel } from '../models/Product.js';
import { ReviewModel } from '../models/Review.js';
import { ApiResponse, Product, Review } from '@osher/shared';

export class ProductController {
  public static async getAll(req: Request, res: Response<ApiResponse<{ products: Product[], total: number, pages: number, current: number }>>) {
    try {
      const { 
        page = 1, 
        limit = 8, 
        search, 
        category, 
        minPrice, 
        maxPrice, 
        sort 
      } = req.query;

      const query: any = {};

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      if (category && category !== 'All') {
        query.category = category;
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      let sortQuery: any = { _id: -1 };
      if (sort === 'price_asc') sortQuery = { price: 1 };
      if (sort === 'price_desc') sortQuery = { price: -1 };
      if (sort === 'name_asc') sortQuery = { name: 1 };
      // Rating and Popularity sorting would typically involve aggregation
      // For simplicity in this step, we'll keep the basic sorts but note the intent

      const skip = (Number(page) - 1) * Number(limit);
      
      const [products, total] = await Promise.all([
        ProductModel.find(query)
          .sort(sortQuery)
          .limit(Number(limit))
          .skip(skip),
        ProductModel.countDocuments(query)
      ]);

      res.json({ 
        success: true, 
        data: {
          products: products as any,
          total,
          pages: Math.ceil(total / Number(limit)),
          current: Number(page)
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async getById(req: Request, res: Response<ApiResponse<Product & { averageRating: number, reviewCount: number, reviews: Review[] }>>) {
    try {
      const product = await ProductModel.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, error: "Product not found" });
      }

      const reviews = await ReviewModel.find({ productId: req.params.id }).populate('userId', 'name');
      
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

      res.json({ 
        success: true, 
        data: { 
          ...product.toObject(), 
          averageRating, 
          reviewCount: reviews.length,
          reviews: reviews.map(r => ({
            id: r._id,
            productId: r.productId,
            userName: (r.userId as any)?.name || 'Anonymous',
            rating: r.rating,
            comment: r.comment,
            createdAt: (r as any).createdAt
          })) as any
        } as any
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async addReview(req: Request, res: Response<ApiResponse<Review>>) {
    try {
      const { productId, rating, comment } = req.body;
      const userId = (req as any).user?.id;
      if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

      // Validate rating and comment
      const ratingNum = Number(rating);
      if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
        return res.status(400).json({ success: false, error: 'Rating must be an integer between 1 and 5' });
      }
      if (!comment || typeof comment !== 'string' || comment.trim().length < 3) {
        return res.status(400).json({ success: false, error: 'Comment must be at least 3 characters' });
      }

      // Ensure the product exists
      const product = await ProductModel.findById(productId);
      if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

      const review = await ReviewModel.create({
        productId,
        userId,
        rating: ratingNum,
        comment: comment.trim()
      });

      res.status(201).json({ success: true, data: review as any });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async create(req: Request, res: Response<ApiResponse<Product>>) {
    try {
      const productData: Product = req.body;
      const product = await ProductModel.create(productData);
      res.status(201).json({ success: true, data: product as any });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async update(req: Request, res: Response<ApiResponse<Product>>) {
    try {
      const productData: Partial<Product> = req.body;
      const product = await ProductModel.findByIdAndUpdate(req.params.id, productData, { new: true });
      if (!product) {
        res.status(404).json({ success: false, error: "Product not found" });
        return;
      }
      res.json({ success: true, data: product as any });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async delete(req: Request, res: Response<ApiResponse<null>>) {
    try {
      const product = await ProductModel.findByIdAndDelete(req.params.id);
      if (!product) {
        res.status(404).json({ success: false, error: "Product not found" });
        return;
      }
      res.json({ success: true, message: "Product deleted" });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
