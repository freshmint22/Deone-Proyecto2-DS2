import React, {useState} from 'react';
import Alert from '../components/Alert';
import { API_BASE } from '../services/api';
import './login.css';

// Forgot password page styled to match login
export default function ForgotPassword(){
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [fieldError, setFieldError] = useState('');

  async function submit(e){
    e.preventDefault();
    setAlert(null);
    setFieldError('');
    if(!email) { setFieldError('Ingresa tu email'); setAlert({type:'error',message:'Corrige los errores del formulario'}); return; }
    setLoading(true);
    try{
      const res = await fetch(`${API_BASE}/api/auth/forgot`,{
        method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})
      });
      const json = await res.json().catch(()=>({}));
      if(!res.ok) throw new Error(json?.message || 'Error');
      setAlert({type:'success',message: json?.message || 'Email enviado'});
    }catch(err){ setAlert({type:'error',message:err.message||'Error'}); }
    finally{ setLoading(false); }
  }

  return (
    <div className="login-page">
      <div className="login-wrap" style={{maxWidth:720}}>
        <div className="brand" style={{width:320}}>
          <div className="logo" aria-hidden>
            <div className="logo-inner">D</div>
          </div>
          <div className="title">Recuperar contraseña</div>
          <div className="subtitle">Te enviaremos un correo con instrucciones</div>
        </div>

        <div className="card">
          {alert && <Alert {...alert} onClose={()=>setAlert(null)} />}
          <form onSubmit={submit} className="login-form">
            <div className="form-group">
              <label htmlFor="forgot-email">Correo</label>
              <input id="forgot-email" name="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="usuario@correo.com" autoComplete="email" aria-invalid={!!fieldError} aria-describedby={fieldError? 'forgot-email-error' : undefined} />
              {fieldError && <div className="field-error" id="forgot-email-error">{fieldError}</div>}
            </div>

            <div className="actions">
              <button className="btn-primary" type="submit" disabled={loading}>{loading? 'Enviando...' : 'Enviar email'}</button>
              <button type="button" className="btn-ghost" onClick={()=>window.location.pathname = '/login'}>Volver</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
