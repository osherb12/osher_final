import { Request, Response } from 'express';
import { CategoryModel } from '../models/Category.js';
import { ProductModel } from '../models/Product.js';
import { ApiResponse } from '@osher/shared';

export class CategoryController {
  public static async getAll(req: Request, res: Response<ApiResponse<any[]>>) {
    try {
      const categories = await CategoryModel.find().sort({ name: 1 });
      res.json({ success: true, data: categories });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async create(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ success: false, error: 'Name is required' });

      const category = await CategoryModel.create({ name });
      res.status(201).json({ success: true, data: category });
    } catch (error: any) {
      if (error.code === 11000) {
        return res.status(400).json({ success: false, error: 'Category already exists' });
      }
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async delete(req: Request, res: Response<ApiResponse<null>>) {
    try {
      const { id } = req.params;

      const category = await CategoryModel.findById(id);
      if (!category) return res.status(404).json({ success: false, error: 'Category not found' });

      const productCount = await ProductModel.countDocuments({ category: category.name });
      if (productCount > 0) {
        return res.status(400).json({
          success: false,
          error: `Cannot delete category "${category.name}" — it has ${productCount} product(s) assigned to it.`
        });
      }

      await CategoryModel.findByIdAndDelete(id);
      res.json({ success: true, message: 'Category deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
