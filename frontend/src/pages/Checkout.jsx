import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { createOrder } from '../services/api';
import Alert from '../components/Alert';

export default function Checkout() {
  const { items, total, clear } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const navigate = useNavigate();

  const paymentMethods = [
    { id: 'card', label: 'Tarjeta', logo: '💳' },
    { id: 'paypal', label: 'PayPal', logo: '🅿️' },
    { id: 'pse', label: 'PSE', logo: '🏦' },
    { id: 'cash', label: 'Efectivo', logo: '💵' },
  ];

  const formatCOP = (v) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(v);

  const readCoupon = () => {
    try {
      return JSON.parse(localStorage.getItem('deone_coupon') || 'null');
    } catch {
      return null;
    }
  };

  // Per user request: remove the demo-order creation logic and simplify
  // the checkout page to only provide a shortcut to track the last order.
  async function onConfirm() {
    setAlert(null);
    // write lastOrderId if we find one in localStorage, but do not create new demo orders
    const last = localStorage.getItem('lastOrderId');
    if (last) {
      // navigate to tracker with the last order prefilled
      window.location.pathname = '/app';
      // Open tracker via local navigation state if available (MainApp handles route state)
      // store a small flag so OrderTracker picks it up when inside /app
      try { localStorage.setItem('openTracker', '1'); } catch(e){}
    } else {
      setAlert({ type: 'info', message: 'No hay pedidos recientes para rastrear.' });
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Confirmar pedido</h2>
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      {!items || items.length === 0 ? (
        <div style={{ padding: 24, textAlign: 'center' }} className="empty-cart">
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              marginBottom: 8,
              color: 'var(--primary)',
            }}
          >
            ¡Te invitamos a seguir comprando!
          </div>
          <div style={{ color: 'var(--muted)', marginBottom: 16 }}>
            Tu carrito está vacío ahora. Explora nuestras ofertas y encuentra algo que te encante.
          </div>
          <button className="btn" onClick={() => navigate('/app')}>
            Seguir comprando
          </button>
        </div>
      ) : (
        <div>
          {items.map((i) => {
            const name = i.nombre || i.name || 'Sin nombre';
            const price = (i.precio ?? i.price) || 0;
            return (
              <div
                key={i.id || i._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: 8,
                  borderBottom: '1px solid #eee',
                }}
              >
                <div>
                  {name} x {i.qty}
                </div>
                <div>{formatCOP(price * (i.qty || 0))}</div>
              </div>
            );
          })}

          <div style={{ marginTop: 12, fontWeight: 700 }}>
            Total: {total != null ? formatCOP(total) : '-'}
          </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ marginTop: 10 }}>
                  <div style={{ marginBottom: 8, fontWeight: 700 }}>Rastreo</div>
                  <div style={{ color: 'var(--muted)', marginBottom: 8 }}>Puedes rastrear tu último pedido aquí.</div>
                  <div>
                    <button onClick={onConfirm} disabled={loading} className="btn">
                      Rastrear último pedido
                    </button>
                  </div>
                </div>
              </div>
        </div>
      )}
    </div>
  );
}
