import { Router } from 'express';
import { getCart, updateCart, clearCart } from '../controllers/cartController.js';

const router = Router();

router.get('/', getCart); // ?userId=...
router.post('/', updateCart); // body { userId, items: [{ productId, quantity }] }
router.delete('/', clearCart); // body { userId }

export default router;
