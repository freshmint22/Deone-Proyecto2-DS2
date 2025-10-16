import React, {useContext} from 'react';
import { CartContext } from '../context/CartContext';
export default function Cart(){
  const { items, removeItem, updateQty, total, clear } = useContext(CartContext);

  if(items.length === 0) return <div style={{padding:20}}>El carrito está vacío</div>;

  return (
    <div style={{padding:20}}>
      <h3>Carrito</h3>
      <div>
        {items.map(p=> (
          <div key={p.id || p._id} style={{display:'flex',gap:12,alignItems:'center',padding:8,borderBottom:'1px solid #eee'}}>
            <div style={{flex:1}}>
              <div style={{fontWeight:700}}>{p.name}</div>
              <div style={{color:'#666'}}>{p.category} - ${p.price}</div>
            </div>
            <div>
              <input type="number" value={p.qty} min={1} onChange={(e)=>updateQty(p.id||p._id, Number(e.target.value))} style={{width:60}} />
            </div>
            <div>
              <button onClick={()=>removeItem(p.id||p._id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{marginTop:12,fontWeight:700}}>Total: ${total}</div>
      <div style={{marginTop:12}}>
        <button onClick={clear} style={{marginRight:8}}>Vaciar carrito</button>
      </div>
    </div>
  );
}
