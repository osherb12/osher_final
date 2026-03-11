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
    email: `admin_cat_${Date.now()}@test.com`,
    name: 'Admin',
    password: hashedPw,
    role: 'admin',
  });
  return jwt.sign({ id: user._id, role: 'admin' }, process.env.JWT_SECRET!);
}

describe('Categories Routes', () => {
  let adminToken: string;

  beforeEach(async () => {
    adminToken = await createAdminToken();
  });

  describe('GET /api/categories', () => {
    it('returns list of categories', async () => {
      const res = await request(app).get('/api/categories');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/categories', () => {
    it('admin can create a category', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Electronics' });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Electronics');
    });

    it('rejects duplicate category name', async () => {
      await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Duplicate' });
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Duplicate' });
      expect(res.status).toBe(400);
    });

    it('rejects creation without auth', async () => {
      const res = await request(app).post('/api/categories').send({ name: 'Nope' });
      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('admin can delete empty category', async () => {
      const created = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'EmptyCat' });
      const id = created.body.data._id;

      const res = await request(app)
        .delete(`/api/categories/${id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('cannot delete category that has products assigned', async () => {
      const catRes = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'BusyCat' });
      const catId = catRes.body.data._id;

      // Create a product in this category
      await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Product in BusyCat',
          description: 'desc',
          price: 10,
          image: 'https://example.com/i.jpg',
          category: 'BusyCat',
          stock: 5,
        });

      const res = await request(app)
        .delete(`/api/categories/${catId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('BusyCat');
    });

    it('returns 404 for non-existent category', async () => {
      const res = await request(app)
        .delete('/api/categories/000000000000000000000000')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.status).toBe(404);
    });
  });
});
