import React, { createContext, useEffect, useState } from 'react';

export const CartContext = createContext({items:[],addItem:()=>{},removeItem:()=>{},updateQty:()=>{},clear:()=>{},total:0});

export function CartProvider({children}){
  const [items, setItems] = useState(()=>{
    try{ return JSON.parse(localStorage.getItem('deone_cart')||'[]'); }catch(e){ return []; }
  });

  useEffect(()=>{ localStorage.setItem('deone_cart', JSON.stringify(items)); },[items]);

  function addItem(product, qty=1){
    setItems(prev=>{
      // create a stable cart id from available identifiers (id, _id, sku, nombre, name)
      const cartId = product.id ?? product._id ?? product.sku ?? product.nombre ?? product.name ?? Math.random().toString(36).slice(2,9);
      const found = prev.find(p=> (p.id || p._id) === cartId);
      if(found){
        return prev.map(p=> ((p.id||p._id)===cartId ? {...p, qty:(p.qty||0)+qty} : p));
      }
      // store the cartId in the `id` field so other code (remove/update) can reference it
      return [...prev, {...product, qty, id: cartId}];
    });
  }

  function removeItem(id){ setItems(prev=> prev.filter(p=> (p.id||p._id) !== id)); }
  function updateQty(id, qty){ setItems(prev=> prev.map(p=> (p.id||p._id) === id ? {...p,qty} : p)); }
  function clear(){ setItems([]); }

  const total = items.reduce((s,p)=> {
    const price = p.precio != null ? p.precio : (p.price != null ? p.price : 0);
    const qty = p.qty || 0;
    return s + price * qty;
  }, 0);

  return (
    <CartContext.Provider value={{items,addItem,removeItem,updateQty,clear,total}}>
      {children}
    </CartContext.Provider>
  );
}
