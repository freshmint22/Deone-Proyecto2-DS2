import { Router } from 'express';
import { getAllProducts, getProductById } from '../controllers/productController.js';
import { seed } from '../scripts/seedProducts.js';

const router = Router();

// GET /api/products
router.get('/', getAllProducts);
// GET /api/products/:id
router.get('/:id', getProductById);

// POST /api/products/seed  <-- protected seeding endpoint (requires SEED_SECRET)
router.post('/seed', async (req, res) => {
	const secret = req.headers['x-seed-secret'] || req.body?.secret;
	const expected = process.env.SEED_SECRET;
	if (!expected) return res.status(403).json({ success: false, message: 'SEED_SECRET not configured on server' });
	if (!secret || secret !== expected) return res.status(401).json({ success: false, message: 'Invalid seed secret' });

	try {
		const uri = process.env.MONGO_URI;
		const result = await seed(uri);
		return res.json({ success: true, inserted: result.inserted });
	} catch (err) {
		console.error('Seed error via /api/products/seed:', err);
		return res.status(500).json({ success: false, message: String(err.message || err) });
	}
});

export default router;
