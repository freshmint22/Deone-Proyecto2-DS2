import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { createOrder } from '../services/api';
import Alert from '../components/Alert';

export default function Checkout() {
  const { items, total, clear, coupon, discount, totalWithDiscount } = useContext(CartContext);
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

  // Show payment modal (simulate pasarela de pagos). On success generate demo order id
  const [showPayment, setShowPayment] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [payerName, setPayerName] = useState('');
  const [location, setLocation] = useState('');
  const [payMethod, setPayMethod] = useState('transferencia');

  function openPayment() {
    setAlert(null);
    // prefill location if user has profile data (best-effort)
    try {
      const profileLoc = user && (user.location || user.campus);
      if (profileLoc) setLocation(profileLoc);
    } catch (e) {}
    setShowPayment(true);
  }

  async function handleFakePayment(e) {
    e && e.preventDefault();
    setAlert(null);
    if (!payerName) {
      setAlert({ type: 'error', message: 'Ingresa el nombre del pagador.' });
      return;
    }
    if (!location) {
      setAlert({ type: 'error', message: 'Ingresa tu ubicación dentro de la universidad.' });
      return;
    }
    setProcessing(true);
    try {
      // simulate processing
      await new Promise((r) => setTimeout(r, 1200));

      const orderId = 'demo-' + Date.now();
      const paymentInfo = { method: payMethod };

      if (payMethod === 'transferencia') {
        // simulate bank reference
        paymentInfo.reference = 'REF' + Math.floor(100000 + Math.random() * 899999);
        paymentInfo.status = 'pagado';
      } else {
        // efectivo: generate a cash code and mark pending payment
        paymentInfo.cashCode = 'CASH' + Math.floor(10000 + Math.random() * 89999);
        paymentInfo.status = 'pendiente_pago';
      }

      const orderObj = {
        id: orderId,
        items: items || [],
        total: totalWithDiscount != null ? totalWithDiscount : total,
        user: user ? (user.id || user._id || user.email) : null,
        status: paymentInfo.status,
        payment: paymentInfo,
        payerName,
        location,
        createdAt: new Date().toISOString(),
      };

      // best-effort create order via API
      try { await createOrder(orderObj).catch(()=>{}); } catch(e){}

      try {
        const raw = localStorage.getItem('demoOrders');
        const map = raw ? JSON.parse(raw) : {};
        map[orderId] = orderObj;
        localStorage.setItem('demoOrders', JSON.stringify(map));
        localStorage.setItem('lastOrderId', orderId);
      } catch (e) {}

      try { clear(); } catch (e) {}
      setShowPayment(false);
      // show specific message depending on method
      if (payMethod === 'transferencia') {
        setAlert({ type: 'success', message: `Pago por transferencia. ID: ${orderId} Ref: ${paymentInfo.reference}` });
      } else {
        setAlert({ type: 'success', message: `Orden creada (efectivo). ID: ${orderId} Código para pago: ${paymentInfo.cashCode}` });
      }
    } finally {
      setProcessing(false);
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

          {coupon && (
            <div style={{ marginTop: 12, color: 'var(--muted)' }}>
              Saldo a favor: {formatCOP(discount)} ({coupon.code})
            </div>
          )}
          <div style={{ marginTop: 12, fontWeight: 700 }}>
            Total: {totalWithDiscount != null ? formatCOP(totalWithDiscount) : '-'}
          </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ marginTop: 10 }}>
                  <div style={{ marginBottom: 8, fontWeight: 700 }}>Rastreo</div>
                  <div style={{ color: 'var(--muted)', marginBottom: 8 }}>Puedes rastrear tu último pedido aquí.</div>
                  <div>
                            <button onClick={openPayment} disabled={loading} className="btn">
                              Realizar pago
                            </button>
                  </div>
                </div>
              </div>
                      {showPayment && (
                        <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.6)',zIndex:1200}}>
                          <form onSubmit={handleFakePayment} style={{background:'#0b0b0b',padding:24,borderRadius:12,minWidth:340,maxWidth:560,color:'#fff',boxShadow:'0 20px 60px rgba(0,0,0,0.6)'}}>
                            <h3 style={{marginTop:0,color:'#fff'}}>Realizar pago</h3>
                            <div style={{marginBottom:12}}>
                              <label style={{display:'block',fontSize:13,marginBottom:6,color:'#ccc'}}>Nombre del pagador</label>
                              <input value={payerName} onChange={e=>setPayerName(e.target.value)} placeholder="Tu nombre" style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #222',background:'#0f0f10',color:'#fff'}} />
                            </div>
                            <div style={{marginBottom:12}}>
                              <label style={{display:'block',fontSize:13,marginBottom:6,color:'#ccc'}}>Ubicación (dentro de la universidad)</label>
                              <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Ej: Facultad de Ingeniería - Bloque B" style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #222',background:'#0f0f10',color:'#fff'}} />
                            </div>
                            <div style={{marginBottom:12}}>
                              <label style={{display:'block',fontSize:13,marginBottom:6}}>Método de pago</label>
                              <div style={{display:'flex',gap:8}}>
                                <label style={{display:'flex',alignItems:'center',gap:6}}>
                                  <input type="radio" name="pm" checked={payMethod==='transferencia'} onChange={()=>setPayMethod('transferencia')} /> Transferencia
                                </label>
                                <label style={{display:'flex',alignItems:'center',gap:6}}>
                                  <input type="radio" name="pm" checked={payMethod==='efectivo'} onChange={()=>setPayMethod('efectivo')} /> Efectivo
                                </label>
                              </div>
                            </div>
                            <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
                              <button type="button" className="pill" onClick={()=>setShowPayment(false)} disabled={processing} style={{background:'transparent',border:'1px solid #272727',color:'#ddd',padding:'8px 12px',borderRadius:8}}>Cancelar</button>
                              <button type="submit" className="btn" disabled={processing} style={{background:'linear-gradient(180deg,#ff5272,#e11b3b)',borderColor:'#e11b3b',padding:'10px 16px',borderRadius:10,boxShadow:'0 14px 36px rgba(225,27,59,0.22)'}}>{processing? 'Procesando...' : 'Confirmar pago'}</button>
                            </div>
                            <div style={{marginTop:12,fontSize:13,color:'var(--muted)'}}>
                              {payMethod === 'transferencia' ? (
                                <div>Al confirmar, se generará una referencia bancaria para que completes la transferencia.</div>
                              ) : (
                                <div>Al confirmar, se creará un código que presentarás para pagar en efectivo en el punto seleccionado.</div>
                              )}
                            </div>
                          </form>
                        </div>
                      )}
        </div>
      )}
    </div>
  );
}
