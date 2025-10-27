import React from 'react';
import { useNavigate } from 'react-router-dom';
import './landing.css';

export default function Landing(){
  const navigate = useNavigate();

  return (
    <div className="landing-hero">
      <div className="landing-card">
        <div className="landing-head">
          <div className="landing-icon" aria-hidden>
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="var(--landing-primary)" strokeWidth="1.6" fill="rgba(217,4,41,0.06)" />
              <path d="M12 7v6l4 2" stroke="var(--landing-primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="landing-title">Deone — Compra rápido, recibe antes</h1>
        </div>

        <p className="landing-sub">Pide y recibe en <strong>minutos</strong>. Regístrate con tu <strong>correo institucional</strong> para acceder a <span className="accent">DESCUENTOS EXCLUSIVOS</span> y seguimiento de pedidos.</p>

        <div className="landing-ctas">
          <button className="cta-primary" onClick={()=>navigate('/register')}>Crear Cuenta y Obtener Descuentos</button>
          <button className="cta-ghost" onClick={()=>navigate('/login')}>Iniciar sesión</button>
        </div>
      </div>
      
      <div className="landing-discounts">
        <div className="discounts-inner">
          <h3>Ofertas de la semana</h3>
          <div className="discount-list promo-grid">
            <div className="discount-card promo" onClick={()=>navigate('/register')}>
              <div className="promo-badge">50% OFF</div>
              <div style={{fontSize:16,fontWeight:800,marginTop:8}}>Prime Snacks</div>
              <div className="muted">Mitad de precio en tu primera compra</div>
            </div>

            <div className="discount-card promo" onClick={()=>navigate('/register')}>
              <div className="promo-badge">DEONE30</div>
              <div style={{fontSize:16,fontWeight:800,marginTop:8}}>Envío Gratis</div>
              <div className="muted">Envío gratis por 30 días al registrarte</div>
            </div>

            <div className="discount-card promo" onClick={()=>navigate('/register')}>
              <div className="promo-badge">🔥 Oferta Flash</div>
              <div style={{fontSize:16,fontWeight:800,marginTop:8}}>Café Premium</div>
              <div className="muted">-40% por tiempo limitado</div>
            </div>

            <div className="discount-card promo" onClick={()=>navigate('/register')}>
              <div className="promo-badge">+Puntos</div>
              <div style={{fontSize:16,fontWeight:800,marginTop:8}}>Programa de puntos</div>
              <div className="muted">Duplica puntos en primeras 5 compras</div>
            </div>

            <div className="discount-card promo" onClick={()=>navigate('/register')}>
              <div className="promo-badge">DEONE50</div>
              <div style={{fontSize:16,fontWeight:800,marginTop:8}}>Pack Ahorro</div>
              <div className="muted">Ahorra hasta 50.000 COP en combos</div>
            </div>
          </div>

          <div style={{marginTop:12}}>
            <button className="cta-primary" onClick={()=>navigate('/register')}>Regístrate y aprovecha estas ofertas</button>
          </div>
        </div>
      </div>
    </div>
  );
}

