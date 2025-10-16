import React, { createContext, useEffect, useState } from 'react';

export const CartContext = createContext({items:[],addItem:()=>{},removeItem:()=>{},updateQty:()=>{},clear:()=>{},total:0});

export function CartProvider({children}){
  const [items, setItems] = useState(()=>{
    try{ return JSON.parse(localStorage.getItem('deone_cart')||'[]'); }catch(e){ return []; }
  });

  useEffect(()=>{ localStorage.setItem('deone_cart', JSON.stringify(items)); },[items]);

  function addItem(product, qty=1){
    setItems(prev=>{
      const found = prev.find(p=>p.id === product.id || p._id === product._id);
      if(found){ return prev.map(p=> p.id===found.id ? {...p,qty:p.qty+qty} : p); }
      return [...prev,{...product,qty}];
    });
  }

  function removeItem(id){ setItems(prev=> prev.filter(p=> (p.id||p._id) !== id)); }
  function updateQty(id, qty){ setItems(prev=> prev.map(p=> (p.id||p._id) === id ? {...p,qty} : p)); }
  function clear(){ setItems([]); }

  const total = items.reduce((s,p)=> s + (p.price||0) * (p.qty||0), 0);

  return (
    <CartContext.Provider value={{items,addItem,removeItem,updateQty,clear,total}}>
      {children}
    </CartContext.Provider>
  );
}
