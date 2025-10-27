import React, { useState } from 'react';
import Alert from './Alert';

export default function OffersSidebar({promotions}){
  const [active, setActive] = useState(null);

  function openOffer(p){ setActive(p); }
  function closeOffer(){ setActive(null); }

  return (
    <>
    <aside className="offers-sidebar">
      <div className="offers-inner">
        <h3 className="offers-title">Oferta del día</h3>
        <div className="offers-list">
          {promotions.length === 0 && (
            <div className="offers-card empty">
              <div className="offers-card-title">No hay promociones activas</div>
              <div className="offers-card-sub">Vuelve pronto para ver ofertas especiales.</div>
            </div>
          )}
          {promotions.map((p,i)=> (
            <div key={p.id || i} className="offers-card">
              <div className="offers-card-title">{p.title || p.nombre || p.name}</div>
              <div className="offers-card-sub">{p.subtitle || p.description || 'Descuento especial por tiempo limitado'}</div>
              <div className="offers-card-cta"><button className="btn" style={{padding:'6px 10px',fontSize:13}} onClick={()=>openOffer(p)}>Ver oferta</button></div>
            </div>
          ))}
        </div>
      </div>
    </aside>

    {active && (
      <div className="offer-modal-overlay" onClick={closeOffer}>
        <div className="offer-modal" role="dialog" aria-modal="true" onClick={e=>e.stopPropagation()}>
          <div className="offer-modal-card">
            <h3 style={{marginTop:0,color:'var(--primary)'}}>{active.title}</h3>
            <p style={{color:'var(--muted)'}}>{active.subtitle}</p>
            <div style={{marginTop:18,display:'flex',gap:12,alignItems:'center'}}>
              <div style={{flex:1}}>
                <div style={{fontSize:18,fontWeight:800}}>Oferta exclusiva: 50% OFF</div>
                <div style={{color:'var(--muted)',marginTop:6}}>Aplica por hoy. Código: DEONE50</div>
              </div>
              <div>
                <button className="btn btn-primary" onClick={()=>{ 
                  // simulate claim: create a coupon and persist it
                  const coupon = { code: 'DEONE50', amount: 20000, label: 'DEONE50 - 20.000 COP' };
                  try{ localStorage.setItem('deone_coupon', JSON.stringify(coupon)); }catch(e){}
                  // dispatch an event so Cart components update immediately
                  try{ window.dispatchEvent(new CustomEvent('couponApplied', { detail: coupon })); }catch(e){}
                  closeOffer();
                  alert('Cupón aplicado: ' + coupon.label);
                }}>Aprovechar</button>
              </div>
            </div>
            <button className="modal-close" onClick={closeOffer} aria-label="Cerrar">×</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
