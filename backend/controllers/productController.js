const Product = require('../models/Product');

// Devuelve todos los productos
async function getAllProducts(req, res) {
  try {
    const products = await Product.find().lean();
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return res.status(500).json({ success: false, message: 'Error del servidor' });
  }
}

module.exports = {
  getAllProducts,
};
