import React, {useState, useContext} from 'react';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import { AuthContext } from './context/AuthContext';

export default function App(){
  const [route, setRoute] = useState('home');
  function navigate(r){ setRoute(r); }
  const { token, logout } = useContext(AuthContext);

  return (
    <div>
      <Header />
      <nav style={{padding:8,background:'#fafafa',borderBottom:'1px solid #eee',display:'flex',alignItems:'center',gap:8}}>
        <div>
          <button onClick={()=>navigate('home')} style={{marginRight:8}}>Inicio</button>
          <button onClick={()=>navigate('register')}>Registro estudiante</button>
        </div>
        <div style={{marginLeft:'auto'}}>
          {!token && <button onClick={()=>navigate('login')}>Ingresar</button>}
          {token && <><button onClick={()=>navigate('profile')}>Perfil</button><button onClick={logout} style={{marginLeft:8}}>Salir</button></>}
        </div>
      </nav>
      <div>
        {route === 'home' && <Home />}
        {route === 'register' && <Register />}
        {route === 'login' && <Login />}
        {route === 'profile' && (
          <PrivateRoute>
            <div style={{padding:20}}>
              <h3>Perfil (Privado)</h3>
              <p>Información del usuario autenticado.</p>
            </div>
          </PrivateRoute>
        )}
      </div>
    </div>
  );
}
