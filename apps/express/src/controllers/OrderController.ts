import { Request, Response } from 'express';
import { OrderModel } from '../models/Order.js';
import { ProductModel } from '../models/Product.js';
import { UserModel } from '../models/User.js';
import { ApiResponse, Order, OrderSchema } from '@osher/shared';
import { VALID_ORDER_STATUSES } from '../config.js';

export class OrderController {
  public static async create(req: Request, res: Response<ApiResponse<Order>>) {
    try {
      // Validate incoming data
      const validation = OrderSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ success: false, error: validation.error.message });
      }

      const orderData = validation.data;
      const user = (req as any).user;
      const userId = user?.id;

      // Validate all items and compute server-side totalPrice
      let serverTotalPrice = 0;
      for (const item of orderData.items) {
        const product = await ProductModel.findById(item.productId);
        if (!product) {
          return res.status(404).json({ success: false, error: `Product ${item.productId} not found` });
        }
        if (product.stock < item.quantity) {
          return res.status(400).json({ success: false, error: `Insufficient stock for ${product.name}` });
        }
        serverTotalPrice += product.price * item.quantity;
      }

      // Always use server-calculated price — never trust the client
      orderData.totalPrice = serverTotalPrice;
      if (userId) orderData.userId = userId;
      orderData.status = 'processing';

      // Decrement stock first; roll back on failure
      const decremented: { productId: string; quantity: number }[] = [];
      try {
        for (const item of orderData.items) {
          await ProductModel.findByIdAndUpdate(item.productId, {
            $inc: { stock: -item.quantity }
          });
          decremented.push({ productId: item.productId, quantity: item.quantity });
        }

        const order = await OrderModel.create(orderData);

        // Clear the user's cart if logged in
        if (userId) {
          await UserModel.findByIdAndUpdate(userId, { cart: [] });
        }

        return res.status(201).json({ success: true, data: order as any });
      } catch (innerError: any) {
        // Roll back all stock decrements that already happened
        for (const item of decremented) {
          await ProductModel.findByIdAndUpdate(item.productId, {
            $inc: { stock: item.quantity }
          }).catch(() => {/* best-effort rollback */});
        }
        throw innerError;
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async getByUserId(req: Request, res: Response<ApiResponse<Order[]>>) {
    try {
      const user = (req as any).user;
      if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

      const orders = await OrderModel.find({ userId: user.id }).sort({ createdAt: -1 });
      res.json({ success: true, data: orders as any });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async getById(req: Request, res: Response<ApiResponse<Order>>) {
    try {
      const order = await OrderModel.findById(req.params.id);
      const user = (req as any).user;

      if (!order) return res.status(404).json({ success: false, error: "Order not found" });

      // If order has userId, check if it matches the current user or if user is admin
      if (order.userId && (!user || (order.userId.toString() !== user.id && user.role !== 'admin'))) {
        return res.status(403).json({ success: false, error: "Unauthorized" });
      }

      res.json({ success: true, data: order as any });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Admin Methods
  public static async getAll(req: Request, res: Response<ApiResponse<Order[]>>) {
    try {
      const orders = await OrderModel.find().sort({ createdAt: -1 });
      res.json({ success: true, data: orders as any });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async updateStatus(req: Request, res: Response<ApiResponse<Order>>) {
    try {
      const { status } = req.body;

      if (!VALID_ORDER_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          error: `Invalid status. Must be one of: ${VALID_ORDER_STATUSES.join(', ')}`
        });
      }

      const order = await OrderModel.findByIdAndUpdate(req.params.id, { status }, { new: true });
      if (!order) return res.status(404).json({ success: false, error: "Order not found" });
      res.json({ success: true, data: order as any });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async cancelOrder(req: Request, res: Response<ApiResponse<Order>>) {
    try {
      const { id } = req.params;
      const user = (req as any).user;
      if (!user) return res.status(401).json({ success: false, error: 'Unauthorized' });

      const userId = user.id;
      const isAdmin = user.role === 'admin';

      const order = await OrderModel.findById(id);
      if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

      // Security: Check ownership
      if (!isAdmin && order.userId?.toString() !== userId) {
        return res.status(403).json({ success: false, error: 'Unauthorized' });
      }

      // Check status
      if (order.status !== 'pending' && order.status !== 'processing') {
        return res.status(400).json({ success: false, error: 'Order cannot be cancelled in its current state' });
      }

      // Restock items BEFORE marking cancelled so a failure here doesn't leave a cancelled order with unreturned stock
      for (const item of order.items) {
        await ProductModel.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity }
        });
      }

      const updatedOrder = await OrderModel.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });

      res.json({ success: true, data: updatedOrder as any, message: 'Order cancelled successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  public static async getStats(req: Request, res: Response<ApiResponse<any>>) {
    try {
      const orders = await OrderModel.find();
      const revenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.totalPrice, 0);

      const productSales: Record<string, { name: string, count: number }> = {};
      orders.forEach(o => {
        if (o.status !== 'cancelled') {
          o.items.forEach(item => {
            if (!productSales[item.productId]) {
              productSales[item.productId] = { name: item.name, count: 0 };
            }
            productSales[item.productId].count += item.quantity;
          });
        }
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      const productCount = await ProductModel.countDocuments();

      res.json({
        success: true,
        data: {
          totalOrders: orders.length,
          totalRevenue: revenue,
          topProducts,
          productCount
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
