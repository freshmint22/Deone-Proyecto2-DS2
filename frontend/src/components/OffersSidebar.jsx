import React from 'react';

export default function OffersSidebar({promotions}){
  return (
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
              <div className="offers-card-cta"><button className="btn" style={{padding:'6px 10px',fontSize:13}}>Ver oferta</button></div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
