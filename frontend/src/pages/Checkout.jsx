import React, {useContext, useState} from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { createOrder } from '../services/api';
import Alert from '../components/Alert';

export default function Checkout(){
  const { items, total, clear } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  async function onConfirm(){
    if(items.length === 0){ setAlert({type:'error',message:'Carrito vacío'}); return; }
    setLoading(true); setAlert(null);
    try{
      const payload = {
        userId: user?.id || user?._id || null,
        items: items.map(i=>({productId: i.id||i._id, quantity: i.qty})),
        total
      };
      const res = await createOrder(payload);
      setAlert({type:'success',message:'Pedido creado correctamente. ID: ' + (res.id || res._id || '')});
      clear();
    }catch(err){ setAlert({type:'error',message:err?.message || 'Error creando pedido'}); }
    finally{ setLoading(false); }
  }

  function formatCOP(value){
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
  }

  return (
    <div style={{padding:20}}>
      <h2>Confirmar pedido</h2>
      {alert && <Alert {...alert} onClose={()=>setAlert(null)} />}
      <div>
        {items.length === 0 ? <div>Carrito vacío</div> : (
          <div>
            {items.map(i=> {
              const name = i.nombre || i.name || 'Sin nombre';
              const price = i.precio != null ? i.precio : i.price || 0;
              return (
              <div key={i.id||i._id} style={{display:'flex',justifyContent:'space-between',padding:8,borderBottom:'1px solid #eee'}}>
                <div>{name} x {i.qty}</div>
                <div>{formatCOP(price * (i.qty||0))}</div>
              </div>
            )})}
            <div style={{marginTop:12,fontWeight:700}}>Total: {formatCOP(total)}</div>
            <div style={{marginTop:12}}>
              <button onClick={onConfirm} disabled={loading}>{loading? 'Procesando...' : 'Confirmar pedido'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
