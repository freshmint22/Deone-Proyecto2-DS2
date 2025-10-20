import { Router } from 'express';
import dotenv from 'dotenv';
import { seed } from '../scripts/seedProducts.js';

dotenv.config();

const router = Router();

// Protected seed endpoint: set SEED_SECRET in your environment and POST to /api/debug/seed
router.post('/seed', async (req, res) => {
  const secret = req.headers['x-seed-secret'] || req.body?.secret;
  const expected = process.env.SEED_SECRET;
  if (!expected) return res.status(403).json({ success:false, message:'SEED_SECRET not configured on server' });
  if (!secret || secret !== expected) return res.status(401).json({ success:false, message:'Invalid seed secret' });

  try {
    const uri = process.env.MONGO_URI;
    const result = await seed(uri);
    return res.json({ success:true, inserted: result.inserted });
  } catch (err) {
    console.error('Seed error via debug route:', err);
    return res.status(500).json({ success:false, message: String(err.message || err) });
  }
});

export default router;
