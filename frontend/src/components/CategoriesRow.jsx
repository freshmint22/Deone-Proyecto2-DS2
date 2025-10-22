import React from 'react';

export default function CategoriesRow({categories, onSelect}){
  return (
    <div style={{display:'flex',gap:14,alignItems:'center',padding:'12px 0',overflowX:'auto'}}>
      {categories.map(c=> (
        <div key={c} style={{minWidth:72,textAlign:'center'}}>
          <div style={{width:56,height:56,borderRadius:14,background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 6px 18px rgba(0,0,0,0.06)'}}>
            {/* simple emoji/icon fallback */}
            <span style={{fontSize:22}} role="img" aria-hidden>🍽️</span>
          </div>
          <div style={{fontSize:12,marginTop:6,color:'#333'}}>{c}</div>
        </div>
      ))}
    </div>
  );
}
