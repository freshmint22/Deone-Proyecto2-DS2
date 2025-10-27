import React, { useEffect, useState } from 'react';
import ProductList from '../components/ProductList';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';
import Cart from '../components/Cart';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Home shows hero and inline product catalog with categories
export default function Home({ navigateLocal, onOpenCart, onOpenSearch, onOpenMenu }){
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');
  const { token, logout } = useContext(AuthContext);

  function closeSearch(){
    // clear the query so filter is removed when the search modal closes
    setQuery('');
    setShowSearch(false);
  }

  useEffect(()=>{ fetchProducts(); },[]);

  async function fetchProducts(){
    setLoading(true); setError(null);
    try{
      const data = await getProducts();
      let list = data || [];
      // If backend returns few/no products, inject demo products for better visual testing
      const demoProducts = [
        { _id: 'p1', nombre: 'Camiseta DeOne', categoria: 'Ropa', precio: 20000 },
        { _id: 'p2', nombre: 'Gorra DeOne', categoria: 'Accesorios', precio: 15000 },
        { _id: 'p3', nombre: 'Mug DeOne', categoria: 'Hogar', precio: 10000 },
        { _id: 'p4', nombre: 'Libreta DeOne', categoria: 'Papelería', precio: 8000 },
        { _id: 'p5', nombre: 'Sudadera DeOne', categoria: 'Ropa', precio: 45000 },
        { _id: 'p6', nombre: 'Bolígrafo DeOne', categoria: 'Papelería', precio: 3000 },
        { _id: 'p7', nombre: 'Audífonos DeOne', categoria: 'Electrónica', precio: 120000 },
        { _id: 'p8', nombre: 'Taza térmica', categoria: 'Hogar', precio: 25000 },
        { _id: 'p9', nombre: 'Mousepad DeOne', categoria: 'Accesorios', precio: 12000 },
        { _id: 'p10', nombre: 'Calcetines DeOne', categoria: 'Ropa', precio: 6000 },
        { _id: 'p11', nombre: 'Llaveros DeOne', categoria: 'Accesorios', precio: 7000 },
        { _id: 'p12', nombre: 'Agenda DeOne', categoria: 'Papelería', precio: 18000 }
      ];
      if(!list || list.length < 4) list = demoProducts;
      setProducts(list);
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
          <p className="hero-sub-black">Descubre productos y recibe tu pedido rápido.</p>
        </div>
          {/* right column for offers removed per request */}
      </section>

      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12}}>
        <h3 style={{margin:0,fontSize:20,fontWeight:700}}>Productos</h3>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          {/* Search input moved to bottom-nav as a magnifier button */}
          <FilterButton categories={categories} category={category} setCategory={setCategory} />
        </div>
      </div>

      {loading && <div>Cargando productos...</div>}
      {error && <div style={{color:'red'}}>{error}</div>}
  {/* removed debug UI */}
      {/* pagination: show 16 items (4x4) and allow sliding between pages */}
      {!loading && !error && (
        <PaginatedProducts products={filtered} pageSize={4} />
      )}

  <div style={{height:84}} />
  {/* Bottom nav and modals lifted to MainApp. Use provided handlers to open app-wide controls */}
  <HamburgerMenu visible={showMenu} onClose={()=>setShowMenu(false)} navigateLocal={navigateLocal} logout={logout} token={token} onOpenCart={onOpenCart} onOpenSearch={onOpenSearch} onOpenMenu={onOpenMenu} />
    </main>
  );
}

function PaginatedProducts({ products, pageSize = 4 }){
  // pageSize default 4 -> 2x2 grid
  const [page, setPage] = React.useState(0);
  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  // build pages array
  const pages = [];
  for(let i=0;i<totalPages;i++) pages.push(products.slice(i*pageSize,(i+1)*pageSize));

  // compute shift percentage relative to track width
  const shift = totalPages > 0 ? (page * (100 / totalPages)) : 0;
  return (
    <div className="slider-wrap">
      <div className="slider-viewport">
        {pages.map((pageItems, idx)=> (
          <div
            key={idx}
            className={`slider-page ${idx===page? 'active':''}`}
            style={{display: idx===page ? 'block' : 'none'}}
            data-page-index={idx}
            data-items-count={pageItems.length}
          >
            {/* Inline grid styles to avoid being overridden by other CSS in consumer environments */}
            <div
              className="page-grid"
              style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:16}}
            >
              {pageItems.map(p=> (
                <div key={p._id || p.id} className="page-cell" style={{display:'flex'}}>
                  <ProductCard product={p} />
                </div>
              ))}

              {/* pad empty cells if pageItems < pageSize to keep 2x2 layout */}
              {Array.from({length: Math.max(0, pageSize - pageItems.length)}).map((_,i)=> (
                <div key={`empty-${i}`} className="page-cell" style={{visibility:'hidden',height:0}} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="slider-controls">
        <button className="btn ghost slider-arrow" onClick={()=>setPage(Math.max(0,page-1))} disabled={page===0} aria-label="Anterior">◀</button>
        <div className="slider-page-indicator">Página {page+1} de {totalPages}</div>
        <button className="btn slider-arrow" onClick={()=>setPage(Math.min(totalPages-1,page+1))} disabled={page>=totalPages-1} aria-label="Siguiente">▶</button>
      </div>
    </div>
  );
}

function ProductCardWrapper({product}){
  // reuse existing ProductCard component directly to keep behavior
  return <ProductCard product={product} />;
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

function FilterButton({ categories, category, setCategory }){
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{position:'relative'}}>
      <button className="filter-btn" onClick={()=>setOpen(v=>!v)} aria-expanded={open}>
        {/* icon: three bars descending */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 6h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M6 12h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M10 18h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div className="filter-menu">
          <button className={`pill ${category===''? 'active':''}`} onClick={()=>{ setCategory(''); setOpen(false); }}>Todo</button>
          {categories.map(c=> (
            <button key={c} className={`pill ${category===c? 'active':''}`} onClick={()=>{ setCategory(c); setOpen(false); }}>{c}</button>
          ))}
        </div>
      )}
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
