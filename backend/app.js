import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import exampleRoutes from './routes/exampleRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor backend DeOne funcionando 🚀');
});

// Mount example routes
app.use('/api/examples', exampleRoutes);

// Connect to MongoDB if MONGO_URI is provided
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.warn('MongoDB connection error:', err.message));
}

export default app;
