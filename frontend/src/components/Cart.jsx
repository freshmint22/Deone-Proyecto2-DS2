import React, {useContext, useEffect, useState} from 'react';
import { CartContext } from '../context/CartContext';

function formatCOP(value){
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
}

export default function Cart({ onPay, onClose }){
  const { items, removeItem, updateQty, total, clear } = useContext(CartContext);
  const [coupon, setCoupon] = useState(null);

  useEffect(()=>{
    function read(){
      try{ const c = JSON.parse(localStorage.getItem('deone_coupon')||'null'); setCoupon(c); }catch(e){ setCoupon(null); }
    }
    read();
    const handler = ()=> read();
    window.addEventListener('couponApplied', handler);
    return ()=> window.removeEventListener('couponApplied', handler);
  },[]);

  if(items.length === 0) return <div style={{padding:20}}>El carrito está vacío</div>;

  return (
    <div style={{padding:20}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h3>Carrito</h3>
        {/* Close button removed to avoid duplication with overlay X */}
      </div>
      <div>
        {items.map(p=> {
          const name = p.nombre || p.name || 'Sin nombre';
          const price = p.precio != null ? p.precio : p.price || 0;
          const category = p.categoria || p.category || '';
          return (
          <div key={p.id || p._id} className="cart-item">
            <div className="info">
              <div style={{fontWeight:700}}>{name}</div>
              <div style={{color:'var(--muted)'}}>
                {category} - <span style={{color:'#000', fontWeight:700}}>{formatCOP(price)}</span>
              </div>
            </div>
            <div>
              <input type="number" value={p.qty} min={1} onChange={(e)=>updateQty(p.id||p._id, Number(e.target.value))} style={{width:80,padding:6,borderRadius:8,border:'1px solid rgba(0,0,0,0.06)',background:'var(--input-bg)',color:'#000'}} />
            </div>
            <div>
              <button className="btn ghost" onClick={()=>removeItem(p.id||p._id)}>Eliminar</button>
            </div>
          </div>
        )})}
      </div>
      {coupon && (
        <div style={{marginTop:8,color:'var(--muted)'}}>Saldo a favor: <strong style={{color:'#000'}}>{formatCOP(coupon.amount)}</strong> ({coupon.code})</div>
      )}
      <div style={{marginTop:12,fontWeight:700,color:'#000'}}>Total: {formatCOP(Math.max(0,total - (coupon?.amount || 0)) )}</div>
      <div style={{marginTop:12,display:'flex',gap:8}}>
        <button className="btn ghost" onClick={clear}>Vaciar carrito</button>
        <button className="btn" onClick={()=>{ if(onPay) onPay(); }}>Proceder al pago</button>
      </div>
    </div>
  );
}
