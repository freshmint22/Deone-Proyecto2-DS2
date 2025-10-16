import { getIO } from '../socket.js';

function emitNewOrder(merchantId, order) {
  const io = getIO();
  if (!io) {
    console.warn('Socket.IO no disponible, omitiendo notificación');
    return;
  }

  io.to(String(merchantId)).emit('newOrder', { orderId: order._id, total: order.total, items: order.items });
}

function emitOrderStatusUpdated(merchantId, order) {
  const io = getIO();
  if (!io) {
    console.warn('Socket.IO no disponible, omitiendo notificación');
    return;
  }

  io.to(String(merchantId)).emit('orderStatusUpdated', { orderId: order._id, status: order.status });
}

function emitLowStock(merchantId, product) {
  const io = getIO();
  if (!io) { console.warn('Socket.IO no disponible, omitiendo lowStock'); return; }
  io.to(String(merchantId)).emit('lowStock', { productId: product._id, stock: product.stock });
}

function notifyUserOrderStatus(userId, order) {
  const io = getIO();
  if (!io) { console.warn('Socket.IO no disponible, omitiendo notifyUser'); return; }
  io.to(String(userId)).emit('orderStatusUpdated', { orderId: order._id, status: order.status });
}

export default {
  emitNewOrder
  , emitOrderStatusUpdated
  , emitLowStock
  , notifyUserOrderStatus
};
