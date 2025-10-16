import Product from '../models/Product.js';
import notificationService from '../services/notificationService.js';

export async function createProduct(req, res) {
  try {
    const { nombre, precio, imagen, descripcion, categoria, stock } = req.body;
    const p = await Product.create({ nombre, precio, imagen, descripcion, categoria, stock });
    return res.status(201).json({ success: true, data: p });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
}

export async function updateProduct(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const p = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!p) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    // if stock decreased, notify merchant
    if (updates.stock !== undefined && updates.stock < 5 && p.merchantId) {
      notificationService.emitLowStock(p.merchantId, p);
    }
    return res.json({ success: true, data: p });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
}

export async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const p = await Product.findByIdAndDelete(id);
    if (!p) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
}

export default { createProduct, updateProduct, deleteProduct };
