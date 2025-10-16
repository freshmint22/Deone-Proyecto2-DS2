import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export async function getCart(req, res) {
  const userId = req.params.userId || req.query.userId;
  if (!userId) return res.status(400).json({ success: false, message: 'userId required' });
  let cart = await Cart.findOne({ user: userId }).populate('items.product').lean();
  if (!cart) {
    cart = { user: userId, items: [] };
  }
  return res.json({ success: true, data: cart });
}

export async function updateCart(req, res) {
  const { userId } = req.body;
  const { items } = req.body;
  if (!userId) return res.status(400).json({ success: false });
  // validate product ids
  const productIds = items.map(i => i.productId);
  const products = await Product.find({ _id: { $in: productIds } }).lean();
  if (products.length !== productIds.length) return res.status(400).json({ success: false, message: 'Some products missing' });

  const cartItems = items.map(i => ({ product: i.productId, quantity: i.quantity }));
  const updated = await Cart.findOneAndUpdate({ user: userId }, { user: userId, items: cartItems }, { upsert: true, new: true }).populate('items.product');
  return res.json({ success: true, data: updated });
}

export async function clearCart(req, res) {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ success: false });
  await Cart.findOneAndDelete({ user: userId });
  return res.json({ success: true });
}

export default { getCart, updateCart, clearCart };
