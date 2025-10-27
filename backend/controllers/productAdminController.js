import Product from '../models/Product.js';
import notificationService from '../services/notificationService.js';

export async function createProduct(req, res) {
  try {
    const { nombre, precio, imagen, descripcion, categoria: bodyCategoria, stock } = req.body;
    // if an authenticated comercio creates a product, associate it and enforce their category
    let categoria = bodyCategoria;
    let merchantId = undefined;
    if (req.user && req.user.role === 'comercio') {
      merchantId = req.user.id;
      // override category to merchant's category to avoid mismatch
      if (req.user.category) categoria = req.user.category;
    }
    const p = await Product.create({ nombre, precio, imagen, descripcion, categoria, stock, merchantId });
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
    const p = await Product.findById(id);
    if (!p) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    // If the requester is a comercio, ensure they own the product
    if (req.user && req.user.role === 'comercio') {
      if (p.merchantId && String(p.merchantId) !== String(req.user.id)) {
        return res.status(403).json({ success: false, message: 'No autorizado para editar este producto' });
      }
      // enforce merchant's category if present
      if (req.user.category) updates.categoria = req.user.category;
    }
    Object.assign(p, updates);
    await p.save();
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
    const p = await Product.findById(id);
    if (!p) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    // If requester is comercio, enforce ownership
    if (req.user && req.user.role === 'comercio') {
      if (p.merchantId && String(p.merchantId) !== String(req.user.id)) {
        return res.status(403).json({ success: false, message: 'No autorizado para eliminar este producto' });
      }
    }
    await Product.findByIdAndDelete(id);
    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
}

export default { createProduct, updateProduct, deleteProduct };
