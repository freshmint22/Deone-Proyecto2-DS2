import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import itemRoutes from './routes/item.routes.js';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/product.routes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor backend DeOne funcionando 🚀');
});

// Mount item routes
app.use('/api/items', itemRoutes);
// Mount user routes
app.use('/api/users', userRoutes);
// Mount auth routes
app.use('/api/auth', authRoutes);
// Mount product routes
app.use('/api/products', productRoutes);

// MongoDB connection handled by server.js using backend/config/db.connectDB

export default app;
