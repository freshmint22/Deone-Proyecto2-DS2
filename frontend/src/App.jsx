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

function MainApp(){
  const navigate = useNavigate();
  const [route, setRoute] = useState('home');
  const { token, logout } = useContext(AuthContext);
  function navigateLocal(r){ setRoute(r); }

  return (
    <div>
      <Header />
      <nav className="topnav">
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          {/* Breadcrumb only (Home is clickable) */}
          <div style={{marginLeft:12,color:'var(--muted)',fontSize:14}}>
            {route==='home' && <button className="breadcrumb-home" onClick={()=>navigateLocal('home')}>Home</button>}
            {route==='cart' && <span><button className="breadcrumb-home" onClick={()=>navigateLocal('home')}>Home</button> <span className="breadcrumb-crumb">/ Carrito</span></span>}
            {route==='checkout' && <span><button className="breadcrumb-home" onClick={()=>navigateLocal('home')}>Home</button> <span className="breadcrumb-crumb">/ Carrito / Pagar</span></span>}
            {route==='orders' && <span><button className="breadcrumb-home" onClick={()=>navigateLocal('home')}>Home</button> <span className="breadcrumb-crumb">/ Pedidos</span></span>}
            {route==='tracker' && <span><button className="breadcrumb-home" onClick={()=>navigateLocal('home')}>Home</button> <span className="breadcrumb-crumb">/ Seguimiento</span></span>}
            {route==='profile' && <span><button className="breadcrumb-home" onClick={()=>navigateLocal('home')}>Home</button> <span className="breadcrumb-crumb">/ Perfil</span></span>}
          </div>
        </div>
      </nav>
      <div>
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
