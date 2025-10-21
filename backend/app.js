import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import itemRoutes from './routes/item.routes.js';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/authRoutes.js';
import passwordRoutes from './routes/password.routes.js';
import productRoutes from './routes/product.routes.js';
import productAdminRoutes from './routes/product.admin.routes.js';
import debugRoutes from './routes/debug.routes.js';
import cartRoutes from './routes/cart.routes.js';
import reportRoutes from './routes/report.routes.js';
import orderRoutes from './routes/order.routes.js';

dotenv.config();

const app = express();
// Allow CORS for the frontend origin(s) provided via env. Support either:
// - FRONTEND_ORIGINS as a comma-separated list of origins
// - FRONTEND_ORIGIN as a single origin (backwards compatible)
const rawOrigins = process.env.FRONTEND_ORIGINS || process.env.FRONTEND_ORIGIN || '*';
let corsOrigins = rawOrigins;
if (rawOrigins !== '*') {
  corsOrigins = rawOrigins.split(',').map(s => s.trim()).filter(Boolean);
  // if only one origin provided, keep it as a string (CORS lib accepts string or array)
  if (corsOrigins.length === 1) corsOrigins = corsOrigins[0];
}
app.use(cors({ origin: corsOrigins, credentials: true }));
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
// Password reset
app.use('/api/auth', passwordRoutes);
// Mount product routes
app.use('/api/products', productRoutes);
// Mount admin product routes
app.use('/api/products/admin', productAdminRoutes);
// Cart
app.use('/api/cart', cartRoutes);
// Reports
app.use('/api/reports', reportRoutes);
// Debug endpoints (protected by SEED_SECRET)
app.use('/api/debug', debugRoutes);
// Mount order routes
app.use('/api/orders', orderRoutes);

// MongoDB connection handled by server.js using backend/config/db.connectDB

export default app;
