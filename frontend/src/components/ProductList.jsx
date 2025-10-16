import React from 'react';
import ProductCard from './ProductCard';

export default function ProductList({products}){
  return (
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12}}>
      {products.map(p=> <ProductCard key={p.id || p._id} product={p} />)}
    </div>
  );
}
