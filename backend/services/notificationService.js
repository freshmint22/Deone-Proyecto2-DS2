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

export default {
  emitNewOrder
  , emitOrderStatusUpdated
};
