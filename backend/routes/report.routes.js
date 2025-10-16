import { Router } from 'express';
import Order from '../models/Order.js';

const router = Router();

// GET /api/reports/sales?merchantId=...
router.get('/sales', async (req, res) => {
  const { merchantId } = req.query;
  if (!merchantId) return res.status(400).json({ success: false, message: 'merchantId required' });

  const sales = await Order.aggregate([
    { $match: { merchantId: new require('mongoose').Types.ObjectId(merchantId) } },
    { $unwind: '$items' },
    { $group: { _id: '$items.product', totalSales: { $sum: '$items.subtotal' }, quantity: { $sum: '$items.quantity' } } },
    { $sort: { totalSales: -1 } }
  ]);

  return res.json({ success: true, data: sales });
});

export default router;
