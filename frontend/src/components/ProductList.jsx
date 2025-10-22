import React from 'react';
import ProductCard from './ProductCard';

export default function ProductList({products}){
  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:18}}>
      {products.map(p=> <ProductCard key={p.id || p._id} product={p} />)}
    </div>
  );
}
