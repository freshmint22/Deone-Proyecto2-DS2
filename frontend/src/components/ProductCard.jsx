import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';

function formatCOP(value){
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
}

export default function ProductCard({product}){
  const { addItem } = useContext(CartContext);
  const [open, setOpen] = useState(false);
  const name = product.nombre || product.name || 'Sin nombre';
  const price = product.precio != null ? product.precio : product.price || 0;
  const category = product.categoria || product.category || '';
  const image = product.imagen || product.image || '/placeholder.png';
  function openDescription(e){ setOpen(true); }
  function closeDescription(){ setOpen(false); }

  return (
    <div className="product-tile" onClick={openDescription} role="button" tabIndex={0} onKeyDown={(e)=>{ if(e.key==='Enter') setOpen(true); }}>
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
          <button className="btn-cart" onClick={(e)=>{ e.stopPropagation(); addItem(product,1); try{ window.dispatchEvent(new CustomEvent('cartItemAdded',{detail:{name}})); }catch(err){} }}>Agregar</button>
        </div>
      </div>
      {open && (
        <div className="modal-overlay" onClick={closeDescription}>
          <div className="modal-content" onClick={e=>e.stopPropagation()}>
            <h3 style={{marginTop:0}}>{name}</h3>
            <div style={{color:'var(--muted)',marginBottom:12}}>{category}</div>
            <div style={{marginBottom:12}}>{product.descripcion || product.description || 'No hay descripción disponible.'}</div>
            <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
              <button className="btn" onClick={()=>{ addItem(product,1); closeDescription(); }}>Agregar al carrito</button>
              <button className="btn ghost" onClick={closeDescription}>Cerrar</button>
            </div>
            <button className="modal-close" aria-label="Cerrar" onClick={closeDescription}>×</button>
          </div>
        </div>
      )}
    </div>
  );
}
