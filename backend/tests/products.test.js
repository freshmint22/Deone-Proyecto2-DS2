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

describe('GET /api/products', () => {
  it('returns 200 and an array of products', async () => {
    // Seed two products
    await Product.create([
      { nombre: 'Producto 1', precio: 10.5, categoria: 'CatA' },
      { nombre: 'Producto 2', precio: 20.0, categoria: 'CatB' }
    ]);

    const res = await request(app).get('/api/products');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);

    // check minimal fields
    expect(res.body.data[0]).toHaveProperty('nombre');
    expect(res.body.data[0]).toHaveProperty('precio');
  });

  it('returns an empty array when no products exist', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(0);
  });
});
