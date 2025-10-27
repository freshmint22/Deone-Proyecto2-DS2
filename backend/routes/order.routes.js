import { Router } from 'express';
import { createOrder, updateOrderStatus, getOrdersForMerchant } from '../controllers/orderController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import checkRole from '../middlewares/checkRole.js';

const router = Router();

// POST /api/orders
router.post('/', createOrder);

// PATCH /api/orders/:id/status -- only comercio or admin
router.patch('/:id/status', authMiddleware, checkRole('comercio', 'admin'), updateOrderStatus);

// GET /api/orders/merchant -- list orders assigned to the authenticated merchant
router.get('/merchant', authMiddleware, checkRole('comercio', 'admin'), getOrdersForMerchant);

export default router;
