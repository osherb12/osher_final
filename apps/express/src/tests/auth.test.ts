import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app.js';

const VALID_PASSWORD = 'Password1234!';

describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('registers a new user and returns a token', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: VALID_PASSWORD,
      });
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('test@example.com');
      expect(res.body.data.user.password).toBeUndefined();
    });

    it('rejects duplicate email', async () => {
      await request(app).post('/api/auth/register').send({
        name: 'User A',
        email: 'dup@example.com',
        password: VALID_PASSWORD,
      });
      const res = await request(app).post('/api/auth/register').send({
        name: 'User B',
        email: 'dup@example.com',
        password: VALID_PASSWORD,
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('rejects weak password', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Test',
        email: 'weak@example.com',
        password: 'weak',
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('rejects missing name', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'noname@example.com',
        password: VALID_PASSWORD,
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('returns token for valid credentials', async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Login User',
        email: 'login@example.com',
        password: VALID_PASSWORD,
      });
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@example.com',
        password: VALID_PASSWORD,
      });
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('rejects wrong password', async () => {
      await request(app).post('/api/auth/register').send({
        name: 'Wrong Pass',
        email: 'wrongpass@example.com',
        password: VALID_PASSWORD,
      });
      const res = await request(app).post('/api/auth/login').send({
        email: 'wrongpass@example.com',
        password: 'WrongPassword1234!',
      });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('rejects non-existent user', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'nobody@example.com',
        password: VALID_PASSWORD,
      });
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/profile', () => {
    it('returns profile for authenticated user', async () => {
      const reg = await request(app).post('/api/auth/register').send({
        name: 'Profile User',
        email: 'profile@example.com',
        password: VALID_PASSWORD,
      });
      const token = reg.body.data.token;

      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('rejects request without token', async () => {
      const res = await request(app).get('/api/auth/profile');
      expect(res.status).toBe(401);
    });
  });
});
