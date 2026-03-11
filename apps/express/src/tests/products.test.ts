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
    email: 'admin@test.com',
    name: 'Admin',
    password: hashedPw,
    role: 'admin',
  });
  return jwt.sign({ id: user._id, role: 'admin' }, process.env.JWT_SECRET!);
}

async function createUserToken(): Promise<string> {
  const res = await request(app).post('/api/auth/register').send({
    name: 'User',
    email: `user_${Date.now()}@test.com`,
    password: VALID_PASSWORD,
  });
  return res.body.data.token;
}

const sampleProduct = {
  name: 'Test Keyboard',
  description: 'A test mechanical keyboard',
  price: 99.99,
  image: 'https://example.com/img.jpg',
  category: 'Electronics',
  stock: 10,
};

describe('Products Routes', () => {
  let adminToken: string;

  beforeEach(async () => {
    adminToken = await createAdminToken();
  });

  describe('GET /api/products', () => {
    it('returns paginated products', async () => {
      const res = await request(app).get('/api/products');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('products');
      expect(res.body.data).toHaveProperty('total');
      expect(res.body.data).toHaveProperty('pages');
    });

    it('filters by search term', async () => {
      await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sampleProduct);

      const res = await request(app).get('/api/products?search=Keyboard');
      expect(res.status).toBe(200);
      expect(res.body.data.products.length).toBeGreaterThan(0);
    });

    it('filters by category', async () => {
      await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sampleProduct);

      const res = await request(app).get('/api/products?category=Electronics');
      expect(res.status).toBe(200);
      expect(res.body.data.products.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/products (admin)', () => {
    it('creates product with valid data', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sampleProduct);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Test Keyboard');
    });

    it('rejects creation without auth', async () => {
      const res = await request(app).post('/api/products').send(sampleProduct);
      expect(res.status).toBe(401);
    });

    it('rejects creation with non-admin token', async () => {
      const userToken = await createUserToken();
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sampleProduct);
      expect(res.status).toBe(403);
    });

    it('rejects invalid product (missing name)', async () => {
      const { name: _name, ...incomplete } = sampleProduct;
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(incomplete);
      expect(res.status).toBe(400);
    });

    it('rejects negative price', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ...sampleProduct, price: -5 });
      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('admin can delete a product', async () => {
      const created = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sampleProduct);
      const id = created.body.data._id;

      const res = await request(app)
        .delete(`/api/products/${id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('returns 404 for non-existent product', async () => {
      const res = await request(app)
        .delete('/api/products/000000000000000000000000')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/products/:id/reviews', () => {
    it('authenticated user can post a review', async () => {
      const prod = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sampleProduct);
      const productId = prod.body.data._id;

      const userToken = await createUserToken();
      const res = await request(app)
        .post(`/api/products/${productId}/reviews`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId, rating: 4, comment: 'Great product!' });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('rejects review with rating out of range', async () => {
      const prod = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sampleProduct);
      const productId = prod.body.data._id;

      const userToken = await createUserToken();
      const res = await request(app)
        .post(`/api/products/${productId}/reviews`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId, rating: 6, comment: 'Too high!' });
      expect(res.status).toBe(400);
    });

    it('rejects review with empty comment', async () => {
      const prod = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sampleProduct);
      const productId = prod.body.data._id;

      const userToken = await createUserToken();
      const res = await request(app)
        .post(`/api/products/${productId}/reviews`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId, rating: 3, comment: 'x' });
      expect(res.status).toBe(400);
    });

    it('rejects review on non-existent product', async () => {
      const userToken = await createUserToken();
      const res = await request(app)
        .post('/api/products/000000000000000000000000/reviews')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ productId: '000000000000000000000000', rating: 5, comment: 'Good one' });
      expect(res.status).toBe(404);
    });

    it('rejects unauthenticated review', async () => {
      const prod = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sampleProduct);
      const productId = prod.body.data._id;

      const res = await request(app)
        .post(`/api/products/${productId}/reviews`)
        .send({ productId, rating: 5, comment: 'Nice product' });
      expect(res.status).toBe(401);
    });
  });
});
