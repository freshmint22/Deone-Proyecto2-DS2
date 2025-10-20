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
    console.error(error.stack);
    return res.status(500).json({ success: false, message: 'Error del servidor' });
  }
}

// Devuelve un producto por ID
export async function getProductById(req, res) {
  try {
    const { id } = req.params;

    // validar ObjectId
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ success: false, message: 'ID de producto inválido' });
    }

    const product = await Product.findById(id).lean();
    if (!product) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Error obteniendo producto por ID:', error);
    return res.status(500).json({ success: false, message: 'Error del servidor' });
  }
}

export default {
  getAllProducts,
};
