import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const orderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  subtotal: { type: Number, required: true, min: 0 }
});

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [orderItemSchema], required: true },
  total: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['pendiente', 'en_preparacion', 'entregado', 'cancelado'], default: 'pendiente' },
  merchantId: { type: Schema.Types.ObjectId, ref: 'User' } // opcional: referencia al comercio
}, { timestamps: true });

const Order = model('Order', orderSchema);

export default Order;
