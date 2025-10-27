import React, {useState, useContext} from 'react';
import Alert from './components/Alert';
import { getProducts } from './services/api';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import BottomNav from './components/BottomNav';
import Register from './pages/Register';
import Login from './pages/Login';
import Cart from './components/Cart';
import Checkout from './pages/Checkout';
import Header from './components/Header';
import Orders from './pages/Orders';
import OrderTracker from './pages/OrderTracker';
import Profile, { ProfileWithNav } from './pages/Profile';
import MerchantDashboard from './pages/MerchantDashboard';
import PrivateRoute from './components/PrivateRoute';
import { AuthContext } from './context/AuthContext';
import Landing from './pages/Landing';
import ForgotPassword from './pages/ForgotPassword';
import Terms from './pages/Terms';
import './pages/app.css';
import OffersSidebar from './components/OffersSidebar';

function MainApp(){
  const navigate = useNavigate();
  const [route, setRoute] = useState('home');
  const { token, logout, user } = useContext(AuthContext);
  const [showCart, setShowCart] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchNote, setSearchNote] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  function navigateLocal(r){ setRoute(r); }

  async function handleSearch(){
    const q = (searchValue || '').trim();
    if(!q){
      setShowSearch(false);
      return;
    }
    try{
      // ask backend to filter by name (uses ?name=...)
      const matches = await getProducts(q);
      if(matches.length > 0){
        try{ localStorage.setItem('deone_search', q); }catch(e){}
        setShowSearch(false);
        navigate('/app');
      } else {
        // no matches: show a short notification and close
        setSearchNote({ type: 'info', message: 'No se encontró' });
        setShowSearch(false);
        setTimeout(()=> setSearchNote(null), 2000);
      }
    }catch(err){
      // on error, still close modal and show message
      setSearchNote({ type: 'error', message: err.message || 'Error buscando' });
      setShowSearch(false);
      setTimeout(()=> setSearchNote(null), 2500);
    }
  }

  // On mount, check for localStorage flags set by other pages (Profile, Checkout)
  // so external navigation to /app can open a specific internal view immediately.
  React.useEffect(()=>{
    try{
      const ot = localStorage.getItem('openTracker');
      const oo = localStorage.getItem('openOrders');
      if(ot){ setRoute('tracker'); localStorage.removeItem('openTracker'); }
      else if(oo){ setRoute('orders'); localStorage.removeItem('openOrders'); }
    }catch(e){ /* ignore */ }
  },[]);

  // mock promotions for admin view (visible in /app)
  const promotions = [
    { id: 'a1', title: 'Envío gratis hoy', subtitle: 'Aplica para pedidos nuevos', image: '/assets/placeholder-product.png' },
    { id: 'a2', title: '-20% en cafeterías', subtitle: 'Oferta por tiempo limitado', image: '/assets/placeholder-product.png' },
  ];

  return (
    <div className="app-shell">
      {searchNote && (
        <div style={{position:'fixed',left:20,top:20,zIndex:6000}}>
          <Alert type={searchNote.type || 'info'} message={searchNote.message} onClose={()=>setSearchNote(null)} />
        </div>
      )}
      <CartNotifier />
      <Header />
      <nav className="topnav">
        <div className="topnav-left">
          <div className="breadcrumbs">
            {route==='home' && <button className="breadcrumb-home" onClick={()=>navigateLocal('home')}>Home</button>}
            {route==='cart' && <span><button className="breadcrumb-home" onClick={()=>navigateLocal('home')}>Home</button> <span className="breadcrumb-crumb">/ Carrito</span></span>}
            {route==='checkout' && <span><button className="breadcrumb-home" onClick={()=>navigateLocal('home')}>Home</button> <span className="breadcrumb-crumb">/ Carrito / Pagar</span></span>}
            {route==='orders' && <span><button className="breadcrumb-home" onClick={()=>navigateLocal('home')}>Home</button> <span className="breadcrumb-crumb">/ Pedidos</span></span>}
            {route==='tracker' && <span><button className="breadcrumb-home" onClick={()=>navigateLocal('home')}>Home</button> <span className="breadcrumb-crumb">/ Seguimiento</span></span>}
            {route==='profile' && <span><button className="breadcrumb-home" onClick={()=>navigateLocal('home')}>Home</button> <span className="breadcrumb-crumb">/ Perfil</span></span>}
          </div>
        </div>

        <div className="topnav-right">
          {/* Removed 'Mi cuenta' and 'Salir' per request; keep only minimal sign-in when not authenticated */}
          {token ? (
            <div className="user-actions">
              {/* Intentionally empty to keep header minimal for /app view */}
            </div>
          ) : (
            <div className="user-actions">
              <button className="btn-ghost" onClick={()=>navigate('/login')}>Iniciar</button>
            </div>
          )}
        </div>
      </nav>

      <div className="app-container">
        <main className="app-content">
          <div className="app-main">
            {route === 'home' && <Home navigateLocal={navigateLocal} onOpenCart={()=>setShowCart(true)} onOpenSearch={()=>setShowSearch(true)} onOpenMenu={()=>setShowMenu(v=>!v)} />}
          {/* Register is handled at top-level route (/register). */}
          {route === 'login' && <Login onSuccess={()=>navigateLocal('home')} />}
          {/* Profile moved to top-level /profile route to apply its own dark layout */}
          {route === 'cart' && <Cart />}
          {route === 'checkout' && <Checkout />}
          {route === 'orders' && <Orders />}
          {route === 'tracker' && <OrderTracker />}
          </div>
          <aside className="app-right">
            <OffersSidebar promotions={promotions} />
          </aside>
        </main>
      </div>
      {/* Global Bottom Navigation so it appears on all /app pages */}
  <BottomNav onHome={()=>navigateLocal('home')} onOpenSearch={()=>setShowSearch(true)} onOpenCart={()=>setShowCart(true)} onOpenMenu={()=>setShowMenu(v=>!v)} />

      {/* Global modals moved to MainApp scope so BottomNav works app-wide */}
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
                {/* Simple search input; Home will also receive open/close handlers via props */}
                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                  <input
                    className="search-input"
                    placeholder="Buscar productos"
                    value={searchValue}
                    onChange={e=>setSearchValue(e.target.value)}
                    onKeyDown={e=>{
                      if(e.key === 'Enter'){
                        e.preventDefault();
                        handleSearch();
                      } else if(e.key === 'Escape'){
                        setShowSearch(false);
                      }
                    }}
                    style={{flex:1,padding:8,borderRadius:8,border:'1px solid rgba(0,0,0,0.06)',background:'var(--input-bg)'}}
                  />
                  <button className="btn" onClick={()=>handleSearch()}>Buscar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showMenu && (
        <div style={{position:'fixed',right:12,bottom:80,background:'var(--card-bg)',border:'1px solid #e6e6e6',borderRadius:8,padding:8,zIndex:3000}}>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            <button className="pill" onClick={()=>{ navigateLocal('orders'); setShowMenu(false); }}>Pedidos</button>
            <button className="pill" onClick={()=>{ navigateLocal('tracker'); setShowMenu(false); }}>Seguimiento</button>
            {token ? (
              <>
                {/* Navigate to the top-level /profile route so Profile's dark styles apply */}
                <button className="pill" onClick={()=>{ navigate('/profile'); setShowMenu(false); }}>Perfil</button>
                {/* Show merchant link for commerce users */}
                {user && user.role === 'comercio' && (
                  <button className="pill" onClick={()=>{ navigate('/commerce'); setShowMenu(false); }}>Ir al comercio</button>
                )}
                <button className="pill" onClick={()=>{ logout(); setShowMenu(false); }}>Salir</button>
              </>
            ) : (
              <button className="pill" onClick={()=>{ window.location.pathname = '/login'; }}>Ingresar</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function CartNotifier(){
  const [note, setNote] = React.useState(null);
  React.useEffect(()=>{
    function onAdd(e){
      const name = e?.detail?.name || 'Producto';
      setNote({ message: `${name} agregado al carrito!` });
      setTimeout(()=> setNote(null), 2000);
    }
    window.addEventListener('cartItemAdded', onAdd);
    return ()=> window.removeEventListener('cartItemAdded', onAdd);
  },[]);
  if(!note) return null;
  return (
    <div style={{position:'fixed',right:20,bottom:100,zIndex:5000}}>
      <div style={{minWidth:200}}>
        <Alert type="success" message={note.message} onClose={()=>setNote(null)} />
      </div>
    </div>
  );
}

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<Landing />} />
      <Route path="/profile" element={<PrivateRoute><ProfileWithNav /></PrivateRoute>} />
      <Route path="/merchant" element={<PrivateRoute><MerchantDashboard /></PrivateRoute>} />
      <Route path="/commerce" element={<PrivateRoute><MerchantDashboard /></PrivateRoute>} />
  <Route path="/login" element={<LoginWrapper />} />
  <Route path="/register" element={<Register />} />
  <Route path="/terms" element={<Terms />} />
  <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/app/*" element={<MainApp />} />
      </Routes>
    </BrowserRouter>
  )
}

function LoginWrapper(){
  const navigate = useNavigate();
  return <Login onSuccess={()=>navigate('/app')} />
}
