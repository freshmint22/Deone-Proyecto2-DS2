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

  it('filters products by name (partial, case-insensitive)', async () => {
    await Product.create([
      { nombre: 'Camiseta DeOne', precio: 15, categoria: 'Ropa' },
      { nombre: 'Gorra DeOne', precio: 12, categoria: 'Accesorios' }
    ]);

    const res = await request(app).get('/api/products').query({ name: 'camis' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].nombre).toMatch(/Camiseta/i);
  });

  it('filters products by category (partial, case-insensitive)', async () => {
    await Product.create([
      { nombre: 'Mug', precio: 8, categoria: 'Hogar' },
      { nombre: 'Plato', precio: 5, categoria: 'Hogar - Cocina' }
    ]);

    const res = await request(app).get('/api/products').query({ category: 'hogar' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(2);
  });

  it('applies both name and category filters together', async () => {
    await Product.create([
      { nombre: 'Camiseta Azul', precio: 10, categoria: 'Ropa' },
      { nombre: 'Camiseta Roja', precio: 11, categoria: 'Ropa' },
      { nombre: 'Gorra Roja', precio: 9, categoria: 'Accesorios' }
    ]);

    const res = await request(app).get('/api/products').query({ name: 'camiseta', category: 'ropa' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(2);
  });
});
