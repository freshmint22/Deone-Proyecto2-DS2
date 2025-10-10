import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { dbName: 'test' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('Auth integration', () => {
  it('registers a user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test.user@correounivalle.edu.co', password: 'password123' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', 'test.user@correounivalle.edu.co');
    expect(res.body).toHaveProperty('token');
  });

  it('rejects duplicate registration', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'dup.user@correounivalle.edu.co', password: 'password123' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User 2', email: 'dup.user@correounivalle.edu.co', password: 'password456' });

    expect(res.statusCode).toBe(409);
  });

  it('rejects non-institutional email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Bad Email', email: 'bad@example.com', password: 'password123' });

    expect(res.statusCode).toBe(400);
  });

  it('allows login with correct credentials', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Login User', email: 'login.user@correounivalle.edu.co', password: 'mypassword' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login.user@correounivalle.edu.co', password: 'mypassword' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('rejects login with wrong password', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Login User2', email: 'login2.user@correounivalle.edu.co', password: 'mypassword' });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login2.user@correounivalle.edu.co', password: 'wrongpass' });

    expect(res.statusCode).toBe(401);
  });
});

