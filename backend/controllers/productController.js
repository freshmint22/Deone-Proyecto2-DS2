import Product from '../models/Product.js';

// Devuelve todos los productos
export async function getAllProducts(req, res) {
  try {
    const { name, category } = req.query;

    const filter = {};

    if (name) {
      // partial, case-insensitive match on nombre
      filter.nombre = { $regex: name, $options: 'i' };
    }

    if (category) {
      filter.categoria = { $regex: category, $options: 'i' };
    }

    const products = await Product.find(filter).lean();
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return res.status(500).json({ success: false, message: 'Error del servidor' });
  }
}

export default {
  getAllProducts,
};
