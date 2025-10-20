import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';

function formatCOP(value){
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
}

export default function ProductCard({product}){
  const { addItem } = useContext(CartContext);
  const [preview, setPreview] = useState(false);
  const name = product.nombre || product.name || 'Sin nombre';
  const price = product.precio != null ? product.precio : product.price || 0;
  const category = product.categoria || product.category || '';
  function getImageSrc(p){
    const raw = p?.imagen || p?.image || '';
    if(!raw) return '/placeholder.png';
    // if already an absolute URL or data URL that looks valid, return as is
    try{
      if(raw.startsWith('data:')){
        // basic validation: should contain base64 marker
        if(raw.includes('base64,')) return raw;
        return '/placeholder.png';
      }
      // allow http(s) and root-relative paths
      if(raw.startsWith('http') || raw.startsWith('//') || raw.startsWith('/')) return raw;
      // otherwise treat as relative path and prefix with / (served from public)
      return '/' + raw;
    }catch(e){
      return '/placeholder.png';
    }
  }
  const image = getImageSrc(product);

  return (
    <>
    <div className="card">
      <div className="media" onClick={()=>setPreview(true)} style={{cursor:'pointer'}}>
        <img src={image} alt={name} style={{maxHeight:'100%',maxWidth:'100%'}} />
      </div>
      <h4>{name}</h4>
      <div className="meta">{category}</div>
      <div className="price">{formatCOP(price)}</div>
      <div style={{marginTop:8}}>
        <button className="btn btn-cart" onClick={()=>addItem(product,1)}>Agregar al carrito</button>
      </div>
    </div>
    {preview && (
      <div className="modal-overlay">
        <div className="modal-content" style={{width:'min(640px,96%)'}}>
          <div style={{display:'flex',gap:12}}>
            <div style={{flex:'0 0 280px'}}>
              <img src={image} alt={name} style={{width:'100%',borderRadius:8}} />
            </div>
            <div style={{flex:1}}>
              <h3>{name}</h3>
              <div style={{color:'#666'}}>{category}</div>
              <p style={{marginTop:12}}>Precio: <strong>{formatCOP(price)}</strong></p>
              <div style={{marginTop:16,display:'flex',gap:8}}>
                <button className="btn btn-cart" onClick={()=>{ addItem(product,1); setPreview(false); }}>Agregar al carrito</button>
                <button className="btn ghost" onClick={()=>setPreview(false)}>Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
