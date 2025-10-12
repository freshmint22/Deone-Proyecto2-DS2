import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/db.js';
import Product from '../models/Product.js';

dotenv.config();

const sampleProducts = [
  {
    nombre: 'Camiseta DeOne',
    precio: 19.99,
    imagen: 'https://example.com/images/camiseta.jpg',
    descripcion: 'Camiseta cómoda y ligera con logo DeOne.',
    categoria: 'Ropa'
  },
  {
    nombre: 'Gorra DeOne',
    precio: 14.5,
    imagen: 'https://example.com/images/gorra.jpg',
    descripcion: 'Gorra ajustable con bordado del logo.',
    categoria: 'Accesorios'
  },
  {
    nombre: 'Mug DeOne',
    precio: 9.99,
    imagen: 'https://example.com/images/mug.jpg',
    descripcion: 'Taza cerámica para tu café de la mañana.',
    categoria: 'Hogar'
  }
];

async function seed() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('MONGO_URI no está configurada en .env; abortando seed.');
    process.exit(1);
  }

  try {
    await connectDB(uri);

    // Limpiar colección antes de sembrar
    await Product.deleteMany({});

    // Insertar productos
    const created = await Product.insertMany(sampleProducts);
    console.log(`Seed completado: insertados ${created.length} productos.`);
  } catch (err) {
    console.error('Error ejecutando seed:', err);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
}

seed();
