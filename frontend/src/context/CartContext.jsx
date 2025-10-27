import React, { createContext, useEffect, useState } from 'react';

export const CartContext = createContext({items:[],addItem:()=>{},removeItem:()=>{},updateQty:()=>{},clear:()=>{},total:0});

export function CartProvider({children}){
  const [items, setItems] = useState(()=>{
    try{ return JSON.parse(localStorage.getItem('deone_cart')||'[]'); }catch(e){ return []; }
  });

  const [coupon, setCoupon] = useState(()=>{
    try{ return JSON.parse(localStorage.getItem('deone_coupon')||'null'); }catch(e){ return null; }
  });

  useEffect(()=>{ localStorage.setItem('deone_cart', JSON.stringify(items)); },[items]);

  function addItem(product, qty=1){
    setItems(prev=>{
      // create a stable cart id from available identifiers (id, _id, sku, nombre, name)
      let cartId = product.id ?? product._id ?? product.sku ?? product.nombre ?? product.name ?? Math.random().toString(36).slice(2,9);
      // normalize to string to avoid type-coercion issues
      cartId = String(cartId);
      const found = prev.find(p=> String(p.id ?? p._id) === cartId);
      if(found){
        return prev.map(p=> (String(p.id ?? p._id)===cartId ? {...p, qty:(p.qty||0)+qty} : p));
      }
      // store the cartId as string in the `id` field so other code (remove/update) can reference it
      return [...prev, {...product, qty, id: cartId}];
    });
  }

  function removeItem(id){ const sid = String(id); setItems(prev=> prev.filter(p=> String(p.id ?? p._id) !== sid)); }
  function updateQty(id, qty){ const sid = String(id); setItems(prev=> prev.map(p=> (String(p.id ?? p._id) === sid ? {...p,qty} : p))); }
  function clear(){ setItems([]); }

  const total = items.reduce((s,p)=> {
    const price = p.precio != null ? p.precio : (p.price != null ? p.price : 0);
    const qty = p.qty || 0;
    return s + price * qty;
  }, 0);

  // discount amount from coupon (absolute amount in COP)
  const discount = coupon && Number.isFinite(Number(coupon.amount)) ? Number(coupon.amount) : 0;
  const totalWithDiscount = Math.max(0, total - discount);

  // listen for couponApplied events emitted by OffersSidebar or other parts
  useEffect(()=>{
    function onCoupon(e){
      if(!e || !e.detail) return;
      try{
        const c = e.detail;
        setCoupon(c);
        localStorage.setItem('deone_coupon', JSON.stringify(c));
      }catch(err){}
    }
    window.addEventListener('couponApplied', onCoupon);
    return ()=> window.removeEventListener('couponApplied', onCoupon);
  },[]);

  return (
    <CartContext.Provider value={{items,addItem,removeItem,updateQty,clear,total,coupon,discount,totalWithDiscount}}>
      {children}
    </CartContext.Provider>
  );
}
