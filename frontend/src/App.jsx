import React, {useState} from 'react';
import Home from './pages/Home';
import Register from './pages/Register';
import Header from './components/Header';

export default function App(){
  const [route, setRoute] = useState('home');
  function navigate(r){ setRoute(r); }

  return (
    <div>
      <Header />
      <nav style={{padding:8,background:'#fafafa',borderBottom:'1px solid #eee'}}>
        <button onClick={()=>navigate('home')} style={{marginRight:8}}>Inicio</button>
        <button onClick={()=>navigate('register')}>Registro estudiante</button>
      </nav>
      <div>
        {route === 'home' && <Home />}
        {route === 'register' && <Register />}
      </div>
    </div>
  );
}
