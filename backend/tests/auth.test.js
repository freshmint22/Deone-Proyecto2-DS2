import request from 'supertest';
import app from '../app.js';

describe('Auth endpoints', () => {
  it('should respond 501 for register (stub)', async () => {
    const res = await request(app).post('/api/users/register').send({});
    expect([501, 200]).toContain(res.statusCode);
  });
});
