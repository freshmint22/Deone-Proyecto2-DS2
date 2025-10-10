import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import itemRoutes from './routes/item.routes.js';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/authRoutes.js';

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

// Connect to MongoDB if MONGO_URI is provided
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.warn('MongoDB connection error:', err.message));
}

export default app;
