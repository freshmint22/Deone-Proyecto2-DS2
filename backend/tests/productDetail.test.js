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

describe('GET /api/products/:id', () => {
  it('returns 200 and product when ID exists', async () => {
    const created = await Product.create({ nombre: 'Detalle Producto', precio: 12.5, categoria: 'Test' });
    const res = await request(app).get(`/api/products/${created._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.nombre).toBe('Detalle Producto');
  });

  it('returns 404 when product not found', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    const res = await request(app).get(`/api/products/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });

  it('returns 400 for invalid id', async () => {
    const res = await request(app).get('/api/products/invalid-id');
    expect(res.statusCode).toBe(400);
  });
});
