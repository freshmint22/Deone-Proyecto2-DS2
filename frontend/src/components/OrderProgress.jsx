import React from 'react';

// pasos: recibido -> en preparación -> listo para entrega
const steps = ['recibido','en preparación','listo para entrega'];

export default function OrderProgress({status}){
  const currentIndex = Math.max(0, steps.indexOf(status));
  return (
    <div>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        {steps.map((s,i)=> (
          <div key={s} style={{flex:1,textAlign:'center'}}>
            <div style={{width:24,height:24,borderRadius:999,margin:'0 auto',background:i<=currentIndex ? '#0b8' : '#ddd'}} />
            <div style={{marginTop:6,fontSize:12}}>{s}</div>
          </div>
        ))}
      </div>
      <div style={{height:8,background:'#eee',borderRadius:8,marginTop:12}}>
        <div style={{width:`${((currentIndex+1)/steps.length)*100}%`,height:'100%',background:'#0b8',borderRadius:8}} />
      </div>
    </div>
  );
}
