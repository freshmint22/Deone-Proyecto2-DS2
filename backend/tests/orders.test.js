import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app.js';
import Product from '../models/Product.js';

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
  await Product.deleteMany({});
});

describe('POST /api/orders', () => {
  it('creates an order and returns 201', async () => {
    const p = await Product.create({ nombre: 'Prod1', precio: 10 });

    const payload = {
      userId: new mongoose.Types.ObjectId().toString(),
      merchantId: new mongoose.Types.ObjectId().toString(),
      items: [{ productId: p._id.toString(), quantity: 2 }]
    };

    const res = await request(app).post('/api/orders').send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('total', 20);
  });

  it('returns 400 if product missing', async () => {
  const payload = { userId: new mongoose.Types.ObjectId().toString(), items: [{ productId: new mongoose.Types.ObjectId().toString(), quantity: 1 }] };
    const res = await request(app).post('/api/orders').send(payload);
    expect(res.statusCode).toBe(400);
  });
});
