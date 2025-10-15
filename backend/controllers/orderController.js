import Product from '../models/Product.js';
import Order from '../models/Order.js';
import notificationService from '../services/notificationService.js';

export async function createOrder(req, res) {
  try {
    const { userId, items, merchantId } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Datos de pedido inválidos' });
    }

    // Fetch products and calculate totals
    const productIds = items.map(i => i.productId);
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    if (products.length !== productIds.length) {
      return res.status(400).json({ success: false, message: 'Algunos productos no existen' });
    }

    // Map productId -> product
    const productMap = new Map(products.map(p => [String(p._id), p]));

    let total = 0;
    const orderItems = items.map(i => {
      const p = productMap.get(String(i.productId));
      const qty = Math.max(1, Number(i.quantity) || 1);
      const price = p.precio || 0;
      const subtotal = price * qty;
      total += subtotal;
      return { product: p._id, quantity: qty, price, subtotal };
    });

    const order = await Order.create({ user: userId, items: orderItems, total, merchantId });

    // Emit notification to merchant (if any)
    try {
      if (merchantId) {
        notificationService.emitNewOrder(merchantId, order);
      }
    } catch (notifyErr) {
      console.error('Error notificando al comercio:', notifyErr);
    }

    return res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error('Error creando orden:', error);
    return res.status(500).json({ success: false, message: 'Error del servidor' });
  }
}

// Actualiza el estado de una orden
export async function updateOrderStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ success: false, message: 'ID de orden inválido' });
    }

    const allowedStatuses = ['pendiente', 'en_preparacion', 'entregado', 'cancelado'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Estado inválido' });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Orden no encontrada' });
    }

    order.status = status;
    await order.save();

    // notify merchant via sockets
    if (order.merchantId) {
      notificationService.emitOrderStatusUpdated(order.merchantId, order);
    }

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Error actualizando estado de orden:', error);
    return res.status(500).json({ success: false, message: 'Error del servidor' });
  }
}

export default {
  createOrder
};
