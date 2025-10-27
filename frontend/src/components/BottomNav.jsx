import React from 'react';

export default function BottomNav({ onHome, onOpenSearch, onOpenCart, onOpenMenu }){
  function HomeIcon(){
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
  function CartIcon(){
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M6 6h15l-1.5 9h-11L6 6z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="10" cy="20" r="1" fill="currentColor"/>
        <circle cx="18" cy="20" r="1" fill="currentColor"/>
      </svg>
    )
  }
  function SearchIcon(){
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
  function MenuIcon(){
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }

  return (
    <div className="bottom-nav" role="navigation" aria-label="Navegación inferior">
      <button aria-label="inicio" className="icon-btn" onClick={onHome}><HomeIcon /></button>
      <button aria-label="buscar" className="icon-btn" onClick={onOpenSearch}><SearchIcon /></button>
      <button aria-label="carrito" className="icon-btn" onClick={onOpenCart}><CartIcon /></button>
      <button aria-label="menu" className="icon-btn" onClick={onOpenMenu}><MenuIcon /></button>
    </div>
  );
}
