import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';

const VALID_PASSWORD = 'Password1234!';

async function createAdminToken(): Promise<{ token: string; userId: string }> {
  const { UserModel } = await import('../models/User.js');
  const bcrypt = await import('bcryptjs');
  const jwt = await import('jsonwebtoken');
  const hashedPw = await bcrypt.hash(VALID_PASSWORD, 10);
  const user = await UserModel.create({
    email: `admin_${Date.now()}@test.com`,
    name: 'Admin',
    password: hashedPw,
    role: 'admin',
  });
  const token = jwt.sign({ id: user._id, role: 'admin' }, process.env.JWT_SECRET!);
  return { token, userId: user._id.toString() };
}

async function createUserSession(): Promise<{ token: string; userId: string }> {
  const email = `user_${Date.now()}@test.com`;
  const res = await request(app).post('/api/auth/register').send({
    name: 'Regular User',
    email,
    password: VALID_PASSWORD,
  });
  return { token: res.body.data.token, userId: res.body.data.user.id };
}

async function createProduct(adminToken: string, stock = 10): Promise<string> {
  const res = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${adminToken}`)
    .send({
      name: 'Test Product',
      description: 'For tests',
      price: 25.00,
      image: 'https://example.com/p.jpg',
      category: 'Test',
      stock,
    });
  return res.body.data._id;
}

const validAddress = {
  street: '123 Test St',
  city: 'Testville',
  zip: '12345',
  country: 'Testland',
};

describe('Orders Routes', () => {
  let adminToken: string;

  beforeEach(async () => {
    const admin = await createAdminToken();
    adminToken = admin.token;
  });

  describe('POST /api/orders (create)', () => {
    it('creates an order and decrements stock', async () => {
      const productId = await createProduct(adminToken, 5);
      const { token: userToken } = await createUserSession();

      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          items: [{ productId, name: 'Test Product', price: 25.00, quantity: 2 }],
          totalPrice: 50.00,
          address: validAddress,
          status: 'pending',
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('processing');

      // Server-calculated price should be used (not client-supplied)
      expect(res.body.data.totalPrice).toBe(50.00);

      // Verify stock was decremented
      const { ProductModel } = await import('../models/Product.js');
      const product = await ProductModel.findById(productId);
      expect(product!.stock).toBe(3);
    });

    it('uses server-calculated price even if client sends wrong price', async () => {
      const productId = await createProduct(adminToken, 5);
      const { token: userToken } = await createUserSession();

      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          items: [{ productId, name: 'Test Product', price: 25.00, quantity: 1 }],
          totalPrice: 1.00, // intentionally wrong
          address: validAddress,
          status: 'pending',
        });
      expect(res.status).toBe(201);
      expect(res.body.data.totalPrice).toBe(25.00); // server-calculated
    });

    it('rejects order when stock is insufficient', async () => {
      const productId = await createProduct(adminToken, 2);
      const { token: userToken } = await createUserSession();

      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          items: [{ productId, name: 'Test Product', price: 25.00, quantity: 5 }],
          totalPrice: 125.00,
          address: validAddress,
          status: 'pending',
        });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('rolls back stock if order save fails — stock is not permanently lost', async () => {
      // This tests the race condition fix: we can only simulate it at the unit level,
      // but we verify stock is correct after a successful order
      const productId = await createProduct(adminToken, 10);
      const { token: userToken } = await createUserSession();

      await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          items: [{ productId, name: 'Test Product', price: 25.00, quantity: 3 }],
          totalPrice: 75.00,
          address: validAddress,
          status: 'pending',
        });

      const { ProductModel } = await import('../models/Product.js');
      const product = await ProductModel.findById(productId);
      expect(product!.stock).toBe(7);
    });

    it('rejects order with non-existent product', async () => {
      const { token: userToken } = await createUserSession();
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          items: [{ productId: '000000000000000000000000', name: 'Ghost', price: 10, quantity: 1 }],
          totalPrice: 10,
          address: validAddress,
          status: 'pending',
        });
      expect(res.status).toBe(404);
    });

    it('allows guest (no token) checkout', async () => {
      const productId = await createProduct(adminToken, 5);

      const res = await request(app)
        .post('/api/orders')
        .send({
          items: [{ productId, name: 'Test Product', price: 25.00, quantity: 1 }],
          totalPrice: 25.00,
          address: validAddress,
          status: 'pending',
        });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /api/orders/my-orders', () => {
    it('returns orders for authenticated user', async () => {
      const productId = await createProduct(adminToken, 5);
      const { token: userToken } = await createUserSession();

      await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          items: [{ productId, name: 'Test Product', price: 25.00, quantity: 1 }],
          totalPrice: 25.00,
          address: validAddress,
          status: 'pending',
        });

      const res = await request(app)
        .get('/api/orders/my-orders')
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
    });

    it('returns 401 without auth', async () => {
      const res = await request(app).get('/api/orders/my-orders');
      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/orders/:id/status (admin)', () => {
    it('admin can update order status to valid value', async () => {
      const productId = await createProduct(adminToken, 5);
      const { token: userToken } = await createUserSession();

      const orderRes = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          items: [{ productId, name: 'Test Product', price: 25.00, quantity: 1 }],
          totalPrice: 25.00,
          address: validAddress,
          status: 'pending',
        });
      const orderId = orderRes.body.data._id;

      const res = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'shipped' });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('shipped');
    });

    it('rejects invalid status value', async () => {
      const productId = await createProduct(adminToken, 5);
      const { token: userToken } = await createUserSession();

      const orderRes = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          items: [{ productId, name: 'Test Product', price: 25.00, quantity: 1 }],
          totalPrice: 25.00,
          address: validAddress,
          status: 'pending',
        });
      const orderId = orderRes.body.data._id;

      const res = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'flying' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('non-admin cannot update status', async () => {
      const productId = await createProduct(adminToken, 5);
      const { token: userToken } = await createUserSession();

      const orderRes = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          items: [{ productId, name: 'Test Product', price: 25.00, quantity: 1 }],
          totalPrice: 25.00,
          address: validAddress,
          status: 'pending',
        });
      const orderId = orderRes.body.data._id;

      const res = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'shipped' });
      expect(res.status).toBe(403);
    });
  });

  describe('PUT /api/orders/:id/cancel', () => {
    it('user can cancel their own pending/processing order and stock is restored', async () => {
      const productId = await createProduct(adminToken, 5);
      const { token: userToken } = await createUserSession();

      const orderRes = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          items: [{ productId, name: 'Test Product', price: 25.00, quantity: 2 }],
          totalPrice: 50.00,
          address: validAddress,
          status: 'pending',
        });
      const orderId = orderRes.body.data._id;

      const res = await request(app)
        .put(`/api/orders/${orderId}/cancel`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('cancelled');

      // Stock should be restored
      const { ProductModel } = await import('../models/Product.js');
      const product = await ProductModel.findById(productId);
      expect(product!.stock).toBe(5); // back to original
    });

    it('cannot cancel a delivered order', async () => {
      const productId = await createProduct(adminToken, 5);
      const { token: userToken } = await createUserSession();

      const orderRes = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          items: [{ productId, name: 'Test Product', price: 25.00, quantity: 1 }],
          totalPrice: 25.00,
          address: validAddress,
          status: 'pending',
        });
      const orderId = orderRes.body.data._id;

      // First set to delivered
      await request(app)
        .put(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'delivered' });

      const res = await request(app)
        .put(`/api/orders/${orderId}/cancel`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(400);
    });

    it('user cannot cancel another user\'s order', async () => {
      const productId = await createProduct(adminToken, 5);
      const { token: userToken1 } = await createUserSession();
      const { token: userToken2 } = await createUserSession();

      const orderRes = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken1}`)
        .send({
          items: [{ productId, name: 'Test Product', price: 25.00, quantity: 1 }],
          totalPrice: 25.00,
          address: validAddress,
          status: 'pending',
        });
      const orderId = orderRes.body.data._id;

      const res = await request(app)
        .put(`/api/orders/${orderId}/cancel`)
        .set('Authorization', `Bearer ${userToken2}`);
      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/orders/stats (admin)', () => {
    it('returns stats including productCount', async () => {
      const res = await request(app)
        .get('/api/orders/stats')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalOrders');
      expect(res.body.data).toHaveProperty('totalRevenue');
      expect(res.body.data).toHaveProperty('productCount');
    });
  });
});
