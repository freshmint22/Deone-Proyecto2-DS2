import React from 'react';
import ProductCard from './ProductCard';

export default function ProductList({products}){
  return (
    <div className="grid">
      {products.map(p=> <ProductCard key={p.id || p._id} product={p} />)}
    </div>
  );
}
