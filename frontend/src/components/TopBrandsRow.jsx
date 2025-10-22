import React from 'react';

export default function TopBrandsRow({brands}){
  return (
    <div style={{padding:'12px 0'}}>
      <h3 style={{margin:'6px 0'}}>¡Los 10 más elegidos!</h3>
      <div style={{display:'flex',gap:16,alignItems:'center',overflowX:'auto',paddingTop:6}}>
        {brands.map(b=> (
          <div key={b} style={{minWidth:96,display:'flex',flexDirection:'column',alignItems:'center'}}>
            <div style={{width:64,height:64,borderRadius:999,background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 8px 24px rgba(0,0,0,0.06)'}}>
              <img src={b.logo || '/assets/placeholder-product.png'} alt={b.name} style={{width:44,height:44,objectFit:'cover',borderRadius:999}} />
            </div>
            <div style={{fontSize:13,marginTop:8,color:'#333'}}>{b.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
