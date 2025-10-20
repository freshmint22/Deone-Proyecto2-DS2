import React, { useEffect, useState } from 'react';
import ProductList from '../components/ProductList';
import { getProducts } from '../services/api';
import Cart from '../components/Cart';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Home shows hero and inline product catalog with categories
export default function Home({ navigateLocal }){
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');
  const { token, logout } = useContext(AuthContext);

  useEffect(()=>{ fetchProducts(); },[]);

  async function fetchProducts(){
    setLoading(true); setError(null);
    try{
      const data = await getProducts();
      setProducts(data || []);
    }catch(err){ setError(err.message || 'Error cargando productos'); }
    finally{ setLoading(false); }
  }

  const categories = Array.from(new Set(products.map(p=> p.categoria || p.category).filter(Boolean)));

  const filtered = products.filter(p=>{
    const name = (p.nombre || p.name || '').toLowerCase();
    if(query && !name.includes(query.toLowerCase())) return false;
    const cat = p.categoria || p.category || '';
    if(category && cat !== category) return false;
    return true;
  });

  return (
    <main className="container">
      <section className="hero">
        <div className="promo">
          <h2>Envíos rápidos y las mejores ofertas</h2>
          <p>Descubre productos y recibe tu pedido rápido.</p>
        </div>
        <div style={{width:220}}>
          <div style={{background:'#fff',padding:12,borderRadius:10}}>Oferta del día</div>
        </div>
      </section>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12}}>
        <h3>Productos</h3>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          {/* Search input moved to bottom-nav as a magnifier button */}
          <select value={category} onChange={e=>setCategory(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categories.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {loading && <div>Cargando productos...</div>}
      {error && <div style={{color:'red'}}>{error}</div>}
      {!loading && !error && <ProductList products={filtered} />}

  <div style={{height:84}} />
  <BottomNav onOpenCart={()=>setShowCart(true)} onOpenMenu={()=>setShowMenu(true)} onOpenSearch={()=>setShowSearch(true)} />
  <HamburgerMenu visible={showMenu} onClose={()=>setShowMenu(false)} navigateLocal={navigateLocal} logout={logout} token={token} />
      {showCart && (
        <div className="modal-overlay">
          <div className="modal-frame">
            <button className="modal-close" onClick={()=>setShowCart(false)}>×</button>
            <div className="modal-window">
              <div className="modal-content">
                <Cart onClose={()=>setShowCart(false)} onPay={()=>{ setShowCart(false); navigateLocal('checkout'); }} />
              </div>
            </div>
          </div>
        </div>
      )}
      {showSearch && (
        <div className="modal-overlay">
          <div className="modal-frame" style={{alignItems:'center',justifyContent:'center'}}>
            <div className="modal-window">
              <div className="modal-content" style={{width:'min(640px,96%)',padding:16}}>
                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                  <input autoFocus placeholder="Buscar productos" value={query} onChange={e=>setQuery(e.target.value)} style={{flex:1,padding:8,borderRadius:8,border:'1px solid #e6e6e6'}} />
                  <button className="btn" onClick={()=>setShowSearch(false)}>Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function BottomNav({ onOpenCart, onOpenMenu, onOpenSearch }){
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
    <div className="bottom-nav">
      <button aria-label="inicio" className="icon-btn"><HomeIcon /></button>
      <button aria-label="buscar" className="icon-btn" onClick={onOpenSearch}><SearchIcon /></button>
      <button aria-label="carrito" className="icon-btn" onClick={onOpenCart}><CartIcon /></button>
      <button aria-label="menu" className="icon-btn" onClick={onOpenMenu}><MenuIcon /></button>
    </div>
  );
}

function HamburgerMenu({ visible, onClose, navigateLocal, logout, token }){
  if(!visible) return null;
  return (
    <div style={{position:'fixed',right:12,bottom:80,background:'var(--card-bg)',border:'1px solid #e6e6e6',borderRadius:8,padding:8,zIndex:3000}}>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        <button className="pill" onClick={()=>{ navigateLocal('orders'); onClose(); }}>Pedidos</button>
        <button className="pill" onClick={()=>{ navigateLocal('tracker'); onClose(); }}>Seguimiento</button>
        {token ? (
          <>
            <button className="pill" onClick={()=>{ navigateLocal('profile'); onClose(); }}>Perfil</button>
            <button className="pill" onClick={()=>{ logout(); onClose(); }}>Salir</button>
          </>
        ) : (
          <button className="pill" onClick={()=>{ window.location.pathname = '/login'; }}>Ingresar</button>
        )}
      </div>
    </div>
  );
}
