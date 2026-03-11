import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';

const VALID_PASSWORD = 'Password1234!';

async function createAdminToken(): Promise<string> {
  const { UserModel } = await import('../models/User.js');
  const bcrypt = await import('bcryptjs');
  const jwt = await import('jsonwebtoken');
  const hashedPw = await bcrypt.hash(VALID_PASSWORD, 10);
  const user = await UserModel.create({
    email: `admin_cart_${Date.now()}@test.com`,
    name: 'Admin',
    password: hashedPw,
    role: 'admin',
  });
  return jwt.sign({ id: user._id, role: 'admin' }, process.env.JWT_SECRET!);
}

async function createUserSession(): Promise<{ token: string; userId: string }> {
  const email = `cartuser_${Date.now()}@test.com`;
  const res = await request(app).post('/api/auth/register').send({
    name: 'Cart User',
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
      name: 'Cart Product',
      description: 'For cart tests',
      price: 15.00,
      image: 'https://example.com/c.jpg',
      category: 'Test',
      stock,
    });
  return res.body.data._id;
}

describe('Cart Routes', () => {
  let adminToken: string;

  beforeEach(async () => {
    adminToken = await createAdminToken();
  });

  describe('POST /api/users/cart', () => {
    it('adds item to cart', async () => {
      const productId = await createProduct(adminToken, 5);
      const { token } = await createUserSession();

      const res = await request(app)
        .post('/api/users/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId, quantity: 2 });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].quantity).toBe(2);
    });

    it('increments quantity when adding same product again', async () => {
      const productId = await createProduct(adminToken, 5);
      const { token } = await createUserSession();

      await request(app)
        .post('/api/users/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId, quantity: 2 });

      const res = await request(app)
        .post('/api/users/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId, quantity: 1 });
      expect(res.body.data[0].quantity).toBe(3);
    });

    it('rejects adding more than stock allows', async () => {
      const productId = await createProduct(adminToken, 2);
      const { token } = await createUserSession();

      const res = await request(app)
        .post('/api/users/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId, quantity: 10 });
      expect(res.status).toBe(400);
    });

    it('rejects adding non-existent product', async () => {
      const { token } = await createUserSession();
      const res = await request(app)
        .post('/api/users/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId: '000000000000000000000000', quantity: 1 });
      expect(res.status).toBe(404);
    });

    it('requires authentication', async () => {
      const productId = await createProduct(adminToken);
      const res = await request(app)
        .post('/api/users/cart')
        .send({ productId, quantity: 1 });
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/users/cart', () => {
    it('returns cart items', async () => {
      const productId = await createProduct(adminToken, 5);
      const { token } = await createUserSession();

      await request(app)
        .post('/api/users/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId, quantity: 1 });

      const res = await request(app)
        .get('/api/users/cart')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe('DELETE /api/users/cart/:productId', () => {
    it('removes item from cart', async () => {
      const productId = await createProduct(adminToken, 5);
      const { token } = await createUserSession();

      await request(app)
        .post('/api/users/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId, quantity: 1 });

      const res = await request(app)
        .delete(`/api/users/cart/${productId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
    });
  });

  describe('DELETE /api/users/cart', () => {
    it('clears all cart items', async () => {
      const productId = await createProduct(adminToken, 5);
      const { token } = await createUserSession();

      await request(app)
        .post('/api/users/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({ productId, quantity: 1 });

      const res = await request(app)
        .delete('/api/users/cart')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);

      const cart = await request(app)
        .get('/api/users/cart')
        .set('Authorization', `Bearer ${token}`);
      expect(cart.body.data).toHaveLength(0);
    });
  });
});
