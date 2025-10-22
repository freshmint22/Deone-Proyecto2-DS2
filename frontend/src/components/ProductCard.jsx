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
  // remove image access to avoid loading external or malformed images
  function getImageSrc(p){
    return '';
  }
  const image = '';

  return (
    <>
    <div className="card" style={{display:'flex',flexDirection:'column',gap:8}}>
      <div style={{position:'relative'}}>
        <div className="media" onClick={()=>setPreview(true)} style={{cursor:'pointer',height:170}}>
          <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--muted)',borderRadius:6,color:'var(--muted)'}}>Imagen no disponible</div>
        </div>
        <div style={{position:'absolute',left:10,top:10,background:'#0ea5a4',color:'#fff',padding:'6px 8px',borderRadius:8,fontSize:12}}>Envío Gratis</div>
      </div>
      <div style={{padding:'0 6px 6px 6px',display:'flex',flexDirection:'column',gap:6}}>
        <h4 style={{margin:0}}>{name}</h4>
        <div className="meta">{category}</div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:6}}>
          <div className="price">{formatCOP(price)}</div>
          <button className="btn btn-cart" onClick={()=>addItem(product,1)}>Agregar</button>
        </div>
      </div>
    </div>
    {preview && (
      <div className="modal-overlay">
        <div className="modal-content" style={{width:'min(640px,96%)'}}>
          <div style={{display:'flex',gap:12}}>
            <div style={{flex:'0 0 280px'}}>
              <div style={{width:'100%',height:200,display:'flex',alignItems:'center',justifyContent:'center',background:'var(--card-bg)',borderRadius:8,color:'var(--muted)'}}>Imagen no disponible</div>
            </div>
            <div style={{flex:1}}>
              <h3>{name}</h3>
              <div style={{color:'var(--muted)'}}>{category}</div>
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
