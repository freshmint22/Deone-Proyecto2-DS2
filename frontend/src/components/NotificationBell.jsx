import React, {useEffect, useState} from 'react';
import { connectSocket, on, off } from '../services/socket';
import Alert from './Alert';

export default function NotificationBell(){
  const [count, setCount] = useState(0);
  const [latest, setLatest] = useState(null);
  const [list, setList] = useState([]);

  useEffect(()=>{
    let mounted = true;
    (async ()=>{
      const s = await connectSocket();
      if(!s) return;
      on('new_order', (order)=>{
        if(!mounted) return;
        setCount(c=>c+1);
        setLatest(order);
        setList(prev=>[order,...prev]);
      });
    })();
    return ()=>{ mounted=false; try{ off('new_order'); }catch(e){} };
  },[]);

  return (
    <div style={{position:'relative',display:'inline-block'}}>
      <button aria-label="notificaciones" className="notif-btn">
        🔔
        {count>0 && <span className="notif-badge">{count}</span>}
      </button>
      {latest && <div style={{position:'absolute',right:0,top:'110%',zIndex:20}}>
        <Alert type="info" message={`Nuevo pedido: ${latest.id || latest._id || ''}`} onClose={()=>setLatest(null)} />
      </div>}
    </div>
  );
}
