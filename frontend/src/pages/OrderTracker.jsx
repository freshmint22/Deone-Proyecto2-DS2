import React, {useEffect, useState} from 'react';
import { getOrder } from '../services/api';
import { connectSocket, on, off } from '../services/socket';
import OrderProgress from '../components/OrderProgress';
import Alert from '../components/Alert';

export default function OrderTracker(){
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(()=>{
    let mounted = true;
    (async ()=>{
      const s = await connectSocket();
      if(!s) return;
      on('orderStatusUpdated', (payload)=>{ if(!mounted) return; if(payload.id === orderId) setOrder(payload); });
    })();
    return ()=>{ mounted=false; try{ off('orderStatusUpdated'); }catch(e){} };
  },[orderId]);

  async function fetchOrder(){
    setError(null);
    try{ const data = await getOrder(orderId); setOrder(data); }
    catch(err){ setError(err.message || 'Error'); }
  }

  return (
    <div style={{padding:20}}>
      <h2>Seguimiento de pedido</h2>
      <div style={{marginBottom:12}}>
        <input placeholder="ID de pedido" value={orderId} onChange={e=>setOrderId(e.target.value)} />
        <button onClick={fetchOrder} style={{marginLeft:8}}>Buscar</button>
      </div>
      {error && <Alert type="error" message={error} />}
      {order && (
        <div>
          <div><strong>ID:</strong> {order.id || order._id}</div>
          <div style={{marginTop:12}}>
            <OrderProgress status={order.status || 'recibido'} />
          </div>
        </div>
      )}
    </div>
  );
}
