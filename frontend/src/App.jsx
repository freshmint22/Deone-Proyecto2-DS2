import React, {useState, useContext} from 'react';
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
import Profile from './pages/Profile';
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
  const { token, logout } = useContext(AuthContext);
  const [showCart, setShowCart] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  function navigateLocal(r){ setRoute(r); }

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
                  <input placeholder="Buscar productos" style={{flex:1,padding:8,borderRadius:8,border:'1px solid rgba(0,0,0,0.06)',background:'var(--input-bg)',color:'var(--text)'}} />
                  <button className="btn" onClick={()=>setShowSearch(false)}>Cerrar</button>
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

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<Landing />} />
  <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
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
