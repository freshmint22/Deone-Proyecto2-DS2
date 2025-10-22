import React, {useState, useContext} from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
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
  function navigateLocal(r){ setRoute(r); }

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
            {route === 'home' && <Home navigateLocal={navigateLocal} />}
          {/* Register is handled at top-level route (/register). */}
          {route === 'login' && <Login onSuccess={()=>navigateLocal('home')} />}
          {route === 'profile' && (
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          )}
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
    </div>
  )
}

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<Landing />} />
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
