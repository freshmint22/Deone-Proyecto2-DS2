import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
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
  await Order.deleteMany({});
});

describe('PATCH /api/orders/:id/status', () => {
  it('allows comercio to update status', async () => {
    const p = await Product.create({ nombre: 'Prod', precio: 5 });
    const orderRes = await request(app).post('/api/orders').send({ userId: new mongoose.Types.ObjectId().toString(), items: [{ productId: p._id.toString(), quantity: 1 }], merchantId: new mongoose.Types.ObjectId().toString() });
    expect(orderRes.statusCode).toBe(201);
    const orderId = orderRes.body.data._id;

    // crear token con role 'comercio'
    const token = jwt.sign({ id: 'some', email: 'm@c.com', role: 'comercio' }, JWT_SECRET);

    const res = await request(app).patch(`/api/orders/${orderId}/status`).set('Authorization', `Bearer ${token}`).send({ status: 'en_preparacion' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('status', 'en_preparacion');
  });

  it('forbids estudiante from updating status', async () => {
    const p = await Product.create({ nombre: 'Prod', precio: 5 });
    const orderRes = await request(app).post('/api/orders').send({ userId: new mongoose.Types.ObjectId().toString(), items: [{ productId: p._id.toString(), quantity: 1 }], merchantId: new mongoose.Types.ObjectId().toString() });
    const orderId = orderRes.body.data._id;

    const token = jwt.sign({ id: 'u1', email: 'u@e.com', role: 'estudiante' }, JWT_SECRET);

    const res = await request(app).patch(`/api/orders/${orderId}/status`).set('Authorization', `Bearer ${token}`).send({ status: 'en_preparacion' });
    expect(res.statusCode).toBe(403);
  });
});
