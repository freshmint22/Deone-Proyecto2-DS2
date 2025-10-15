import { Router } from 'express';
import { getAllProducts, getProductById } from '../controllers/productController.js';

const router = Router();

// GET /api/products
router.get('/', getAllProducts);
// GET /api/products/:id
router.get('/:id', getProductById);

export default router;
