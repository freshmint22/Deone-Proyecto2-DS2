import React from 'react';

export default function OffersSidebar({promotions}){
  return (
    <aside style={{width:300,marginLeft:20}}>
      <div style={{position:'sticky',top:16}}>
        <h3 style={{marginTop:0}}>Oferta del día</h3>
        <div style={{display:'flex',flexDirection:'column',gap:12,marginTop:8,maxHeight:'70vh',overflowY:'auto',paddingRight:6}}>
          {promotions.length === 0 && (
            <div style={{padding:12,background:'#fff',borderRadius:10,boxShadow:'0 8px 24px rgba(0,0,0,0.06)'}}>
              <div style={{fontWeight:700}}>No hay promociones activas</div>
              <div style={{fontSize:13,color:'#666'}}>Vuelve pronto para ver ofertas especiales.</div>
            </div>
          )}
          {promotions.map((p,i)=> (
            <div key={p.id || i} style={{padding:12,background:'#fff',borderRadius:10,boxShadow:'0 8px 24px rgba(0,0,0,0.06)'}}>
              <div style={{fontWeight:700,color:'#111'}}>{p.title || p.nombre || p.name}</div>
              <div style={{fontSize:13,color:'#666',marginTop:6}}>{p.subtitle || p.description || 'Descuento especial por tiempo limitado'}</div>
              <div style={{marginTop:8}}><button className="btn" style={{padding:'6px 10px',fontSize:13}}>Ver oferta</button></div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
