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
    categoria: 'Ropa',
    stock: 20
  },
  {
    nombre: 'Gorra DeOne',
    precio: 14.5,
    imagen: 'https://example.com/images/gorra.jpg',
    descripcion: 'Gorra ajustable con bordado del logo.',
    categoria: 'Accesorios',
    stock: 15
  },
  {
    nombre: 'Mug DeOne',
    precio: 9.99,
    imagen: 'https://example.com/images/mug.jpg',
    descripcion: 'Taza cerámica para tu café de la mañana.',
    categoria: 'Hogar',
    stock: 30
  }
];

async function seed(uri) {
  if (!uri) {
    throw new Error('MONGO_URI no proporcionada');
  }

  await connectDB(uri);
  try {
    // Limpiar colección antes de sembrar
    await Product.deleteMany({});

    // Insertar productos
    const created = await Product.insertMany(sampleProducts);
    return { inserted: created.length };
  } finally {
    await disconnectDB();
  }
}

// If run directly from CLI, execute with env MONGO_URI (backwards compatible)
if (process.argv[1] && process.argv[1].endsWith('seedProducts.js')) {
  (async () => {
    try {
      const uri = process.env.MONGO_URI;
      if (!uri) {
        console.error('MONGO_URI no está configurada en .env; abortando seed.');
        process.exit(1);
      }
      const result = await seed(uri);
      console.log(`Seed completado: insertados ${result.inserted} productos.`);
      process.exit(0);
    } catch (err) {
      console.error('Error ejecutando seed:', err);
      process.exit(1);
    }
  })();
}

export { seed };
