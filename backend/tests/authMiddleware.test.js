import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middlewares/authMiddleware.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

describe('authMiddleware', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.get('/protected', authMiddleware, (req, res) => {
      res.json({ ok: true, user: req.user });
    });
  });

  it('rejects when no token provided', async () => {
    const res = await request(app).get('/protected');
    expect(res.statusCode).toBe(401);
  });

  it('rejects when token is invalid', async () => {
    const res = await request(app).get('/protected').set('Authorization', 'Bearer invalid.token');
    expect(res.statusCode).toBe(401);
  });

  it('allows when token is valid', async () => {
    const payload = { id: '123', email: 'a@b.com', role: 'estudiante' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    const res = await request(app).get('/protected').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', 'a@b.com');
  });
});
