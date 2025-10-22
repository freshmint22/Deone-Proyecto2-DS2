import React, {useState, useContext} from 'react';
import { login } from '../services/auth';
import Alert from '../components/Alert';
import { AuthContext } from '../context/AuthContext';
import './login.css';

export default function Login({onSuccess}){
  const [form, setForm] = useState({email:'',password:''});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const { setToken, setUser } = useContext(AuthContext);

  function onChange(e){ setForm({...form,[e.target.name]:e.target.value}); }

  async function onSubmit(e){
    e.preventDefault();
    setAlert(null);
    if(!form.email || !form.password) { setAlert({type:'error',message:'Completa email y contraseña'}); return; }
    setLoading(true);
  try{
    const data = await login({email:form.email,password:form.password});
    setToken(data.token);
    if(setUser && data.user) setUser(data.user);
    setAlert({type:'success',message:'Ingreso exitoso'});
    if(typeof onSuccess === 'function') onSuccess();
  }catch(err){
      setAlert({type:'error',message:err?.message || 'Error en login'});
    }finally{ setLoading(false); }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h2>Iniciar sesión</h2>
          <p>Accede con tu cuenta para continuar</p>
        </div>
        {alert && <Alert {...alert} onClose={()=>setAlert(null)} />}
        <form onSubmit={onSubmit} className="login-form">
          <div>
            <label>Email</label>
            <input name="email" value={form.email} onChange={onChange} />
          </div>
          <div>
            <label>Contraseña</label>
            <input name="password" type="password" value={form.password} onChange={onChange} />
          </div>
          <div className="login-actions">
            <button className="btn" type="submit" disabled={loading}>{loading? 'Ingresando...' : 'Entrar'}</button>
            <a onClick={(e)=>{ e.preventDefault(); if(onSuccess) onSuccess(); else window.location.pathname = '/forgot'; }} style={{fontSize:13,cursor:'pointer',color:'var(--muted)'}}>Olvidé mi contraseña</a>
          </div>
        </form>
        <div className="login-cta">
          <button className="btn ghost" onClick={()=>window.location.pathname = '/register'}>Crear cuenta</button>
        </div>
        <div className="login-note">¿No tienes cuenta? Regístrate para descubrir productos exclusivos.</div>
      </div>
    </div>
  );
}
