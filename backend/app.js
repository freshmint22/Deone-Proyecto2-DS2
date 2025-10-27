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
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

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
// Increase JSON/body-parser limits to accept product images sent as base64 data URLs from the frontend.
// Default limit is small (~100kb) which causes 413 when uploading base64 images; set to 10MB for now.
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded static files
// Resolve __dirname equivalent for ESM and compute a stable uploads directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, 'public', 'uploads');

// Ensure uploads directory exists (avoid ENOENT when multer writes files)
try{
  await import('fs').then(fs => fs.mkdirSync(uploadsDir, { recursive: true }));
}catch(e){ /* ignore */ }

app.use('/uploads', express.static(uploadsDir));

// Simple multer setup for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.jpg';
    const name = Date.now() + '-' + Math.random().toString(36).slice(2,8) + ext;
    cb(null, name);
  }
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } }); // 2MB

// POST /api/users/upload-avatar -> returns { url }
app.post('/api/users/upload-avatar', upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  return res.json({ success: true, url });
});

// Log allowed origins at startup (helpful to verify in Render logs)
try{
  // normalize for logging
  const logOrigins = Array.isArray(corsOrigins) ? corsOrigins : [corsOrigins];
  console.log('🌐 Allowed origins:', logOrigins);
}catch(e){
  console.log('🌐 Allowed origins: *');
}

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
