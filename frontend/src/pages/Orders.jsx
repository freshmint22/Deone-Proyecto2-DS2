import React, {useEffect, useState} from 'react';
import { getOrders } from '../services/api';
import { connectSocket, on, off } from '../services/socket';

export default function Orders(){
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(()=>{
    fetchOrders();
    let mounted = true;
    (async ()=>{
      const s = await connectSocket();
      if(!s) return;
      on('new_order', (order)=>{ if(!mounted) return; setOrders(prev=>[order,...prev]); });
    })();
    return ()=>{ mounted=false; try{ off('new_order'); }catch(e){} };
  },[]);

  async function fetchOrders(){
    try{ const data = await getOrders(); setOrders(data || []); }
    catch(err){ setError(err.message || 'Error'); }
  }

  return (
    <div style={{padding:20}}>
      <h2>Pedidos</h2>
      {error && <div style={{color:'red'}}>{error}</div>}
      <div>
        {orders.map(o=> (
          <div key={o.id||o._id} style={{padding:10,borderBottom:'1px solid #eee'}}>
            <div><strong>ID:</strong> {o.id||o._id}</div>
            <div><strong>Estado:</strong> {o.status || 'nuevo'}</div>
            <div><strong>Total:</strong> ${o.total || ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
