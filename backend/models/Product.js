import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 10,
    min: 0
  },
  imagen: {
    type: String,
    required: false
  },
  descripcion: {
    type: String,
    required: false
  },
  categoria: {
    type: String,
    required: false
  }
  ,
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
});

// useful indexes for search
productSchema.index({ nombre: 'text', categoria: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
