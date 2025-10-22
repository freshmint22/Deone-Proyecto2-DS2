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
          <div className="discount-list">
            <div className="discount-card">Producto A<br/><small className="muted">-15%</small></div>
            <div className="discount-card">Producto B<br/><small className="muted">-10%</small></div>
            <div className="discount-card">Producto C<br/><small className="muted">-25%</small></div>
            <div className="discount-card">Producto D<br/><small className="muted">-5%</small></div>
          </div>
          <div style={{marginTop:12}}><button className="cta-ghost" onClick={()=>navigate('/login')}>Ver todos los descuentos</button></div>
        </div>
      </div>
    </div>
  );
}

