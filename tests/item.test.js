import request from 'supertest';
import app from '../backend/app.js';

describe('Item endpoints', () => {
  it('should respond 501 for GET /api/items (stub)', async () => {
    const res = await request(app).get('/api/items');
    expect([501, 200]).toContain(res.statusCode);
  });
});
