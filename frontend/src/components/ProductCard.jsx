import React from 'react';

export default function ProductCard({product}){
  return (
    <div style={{border:'1px solid #eee',borderRadius:6,padding:12,background:'#fff'}}>
      <div style={{height:120,background:'#f4f4f4',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:8}}>
        <img src={product.image || '/placeholder.png'} alt={product.name} style={{maxHeight:'100%',maxWidth:'100%'}} />
      </div>
      <h4 style={{margin:'4px 0'}}>{product.name}</h4>
      <div style={{color:'#666',fontSize:14}}>{product.category}</div>
      <div style={{marginTop:8,fontWeight:700}}>${product.price}</div>
    </div>
  );
}
