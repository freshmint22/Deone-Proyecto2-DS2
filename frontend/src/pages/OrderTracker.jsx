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
    // if user navigates to tracker, prefill with last demo order if available
    try{
      const last = localStorage.getItem('lastOrderId');
      if(last) setOrderId(last);
    }catch(e){}
  },[]);

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

  // helper: try local demo orders when backend isn't available
  function tryLocalOrder(){
    try{
      const demoRaw = localStorage.getItem('demoOrders');
      if(!demoRaw) return null;
      const demo = JSON.parse(demoRaw);
      return demo[orderId] || null;
    }catch(e){ return null; }
  }

  return (
    <div className="content">
      <h2>Seguimiento de pedido</h2>
      <div style={{marginBottom:12}}>
        <button
          className="btn"
          onClick={async ()=>{
            setError(null);
            const last = localStorage.getItem('lastOrderId');
            if(!last){ setError('No hay último pedido guardado'); return; }
            setOrderId(last);
            const local = tryLocalOrder();
            if(local){ setOrder(local); return; }
            try{ const data = await getOrder(last); setOrder(data); }
            catch(err){ setError(err.message || 'Error al obtener el pedido'); }
          }}
        >Buscar último pedido</button>
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
