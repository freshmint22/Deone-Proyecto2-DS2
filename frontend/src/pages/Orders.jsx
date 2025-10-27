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
    const handler = (e)=>{ const o = e?.detail; if(o) setOrders(prev=>[o,...prev]); };
    window.addEventListener('demoOrderCreated', handler);
    return ()=>{ mounted=false; try{ off('new_order'); }catch(e){}; window.removeEventListener('demoOrderCreated', handler); };
  },[]);

  async function fetchOrders(){
    try{
      const data = await getOrders();
      // load demoOrders from localStorage and merge
      const demoRaw = localStorage.getItem('demoOrders');
      const demo = demoRaw ? Object.values(JSON.parse(demoRaw)) : [];
      const merged = [...(data || []), ...demo].sort((a,b)=> (b.createdAt || 0) - (a.createdAt || 0));
      setOrders(merged || []);
    }
    catch(err){
      // if API fails, fallback to demo orders
      const demoRaw = localStorage.getItem('demoOrders');
      const demo = demoRaw ? Object.values(JSON.parse(demoRaw)) : [];
      setOrders(demo || []);
      setError(err.message || 'Error');
    }
  }

  return (
    <div style={{padding:20}}>
      <h2>Pedidos</h2>
      {error && <div style={{color:'red'}}>{error}</div>}
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {orders.map(o=> (
          <div key={o.id||o._id} className="card-panel" style={{padding:12}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <div><strong>ID:</strong> {o.id||o._id}</div>
              <div style={{color:'var(--muted)'}}>{o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}</div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 120px',gap:12}}>
              <div>
                {o.items && o.items.map((it,idx)=> (
                  <div key={idx} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px dashed #eee'}}>
                    <div>{it.name || it.productId} x {it.qty || 1}</div>
                    <div>{(new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format((it.price||it.price===0)? it.price * (it.qty||1) : it.total || 0))}</div>
                  </div>
                ))}
              </div>
              <div style={{textAlign:'right'}}>
                <div><strong>Total</strong></div>
                <div style={{fontSize:18,fontWeight:800}}>{new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(o.total || 0)}</div>
                <div style={{marginTop:8}}><span className="pill">{o.paymentMethod || '—'}</span></div>
                <div style={{marginTop:8,color:'var(--muted)'}}>Estado: <strong>{o.status || 'nuevo'}</strong></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
