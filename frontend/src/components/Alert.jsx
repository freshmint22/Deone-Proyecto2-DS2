import React from 'react';

export default function Alert({type='info',message,onClose}){
  const bg = type==='success' ? '#e6ffed' : type==='error' ? '#ffe6e6' : '#eef2ff';
  const color = type==='success' ? '#086c3f' : type==='error' ? '#a00' : '#0b3b8c';
  return (
    <div style={{background:bg,color:color,padding:12,borderRadius:6,marginBottom:12,display:'flex',justifyContent:'space-between',alignItems:'center'}} role="alert">
      <div>{message}</div>
      {onClose && <button onClick={onClose} style={{marginLeft:12}}>Cerrar</button>}
    </div>
  );
}
