import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

function formatCOP(value){
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
}

export default function ProductCard({product}){
  const { addItem } = useContext(CartContext);
  const name = product.nombre || product.name || 'Sin nombre';
  const price = product.precio != null ? product.precio : product.price || 0;
  const category = product.categoria || product.category || '';
  const image = product.imagen || product.image || '/placeholder.png';
  return (
    <div className="product-tile">
      <div style={{position:'relative'}}>
        <div className="media">
          {image ? <img src={image} alt={name} style={{maxHeight:'100%',maxWidth:'100%',borderRadius:8}} /> : <div className="media-placeholder">Imagen no disponible</div>}
        </div>
        <div className="pill">Envío Gratis</div>
      </div>
      <div className="product-body">
        <h4>{name}</h4>
        <div className="meta">{category}</div>
        <div className="product-bottom">
          <div className="price">{formatCOP(price)}</div>
          <button className="btn-cart" onClick={()=>addItem(product,1)}>Agregar</button>
        </div>
      </div>
    </div>
  );
}
