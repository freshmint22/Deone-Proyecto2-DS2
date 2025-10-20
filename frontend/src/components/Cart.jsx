import React, {useContext} from 'react';
import { CartContext } from '../context/CartContext';

function formatCOP(value){
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
}

export default function Cart({ onPay, onClose }){
  const { items, removeItem, updateQty, total, clear } = useContext(CartContext);

  if(items.length === 0) return <div style={{padding:20}}>El carrito está vacío</div>;

  return (
    <div style={{padding:20}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h3>Carrito</h3>
        {onClose && <button className="pill" onClick={onClose}>Cerrar</button>}
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
              <div style={{color:'#666'}}>{category} - {formatCOP(price)}</div>
            </div>
            <div>
              <input type="number" value={p.qty} min={1} onChange={(e)=>updateQty(p.id||p._id, Number(e.target.value))} style={{width:80,padding:6,borderRadius:8,border:'1px solid #e6e6e6'}} />
            </div>
            <div>
              <button className="btn ghost" onClick={()=>removeItem(p.id||p._id)}>Eliminar</button>
            </div>
          </div>
        )})}
      </div>
      <div style={{marginTop:12,fontWeight:700}}>Total: {formatCOP(total)}</div>
      <div style={{marginTop:12,display:'flex',gap:8}}>
        <button className="btn ghost" onClick={clear}>Vaciar carrito</button>
        <button className="btn" onClick={()=>{ if(onPay) onPay(); }}>Proceder al pago</button>
      </div>
    </div>
  );
}
