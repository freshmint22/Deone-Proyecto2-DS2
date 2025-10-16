import React, {useContext, useState} from 'react';
import { CartContext } from '../context/CartContext';
import { createOrder } from '../services/api';
import Alert from '../components/Alert';

export default function Checkout(){
  const { items, total, clear } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  async function onConfirm(){
    if(items.length === 0){ setAlert({type:'error',message:'Carrito vacío'}); return; }
    setLoading(true); setAlert(null);
    try{
      const payload = { items: items.map(i=>({productId: i.id||i._id, quantity: i.qty})), total };
      const res = await createOrder(payload);
      setAlert({type:'success',message:'Pedido creado correctamente. ID: ' + (res.id || res._id || '')});
      clear();
    }catch(err){ setAlert({type:'error',message:err?.message || 'Error creando pedido'}); }
    finally{ setLoading(false); }
  }

  return (
    <div style={{padding:20}}>
      <h2>Confirmar pedido</h2>
      {alert && <Alert {...alert} onClose={()=>setAlert(null)} />}
      <div>
        {items.length === 0 ? <div>Carrito vacío</div> : (
          <div>
            {items.map(i=> (
              <div key={i.id||i._id} style={{display:'flex',justifyContent:'space-between',padding:8,borderBottom:'1px solid #eee'}}>
                <div>{i.name} x {i.qty}</div>
                <div>${(i.price||0) * (i.qty||0)}</div>
              </div>
            ))}
            <div style={{marginTop:12,fontWeight:700}}>Total: ${total}</div>
            <div style={{marginTop:12}}>
              <button onClick={onConfirm} disabled={loading}>{loading? 'Procesando...' : 'Confirmar pedido'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
