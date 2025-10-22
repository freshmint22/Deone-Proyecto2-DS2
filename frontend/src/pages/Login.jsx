import React, {useState, useContext} from 'react';
import { login } from '../services/auth';
import Alert from '../components/Alert';
import { AuthContext } from '../context/AuthContext';
import './login.css';

export default function Login({onSuccess}){
  const [form, setForm] = useState({email:'',password:''});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
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
      <div className="login-wrap">
        <div className="brand">
          <div className="logo" aria-hidden>
            <div className="logo-inner">D</div>
          </div>
          <div className="title">Inicia sesión</div>
          <div className="subtitle">Accede con tu cuenta institucional</div>
        </div>

        <div className="card">
          {alert && <Alert {...alert} onClose={()=>setAlert(null)} />}
          <form onSubmit={onSubmit} className="login-form">
            <div className="form-group">
              <label>Correo</label>
              <input name="email" value={form.email} onChange={onChange} placeholder="usuario@correounivalle.edu.co" autoComplete="email" />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <div style={{position:'relative'}}>
                <input name="password" type={showPassword? 'text' : 'password'} value={form.password} onChange={onChange} autoComplete="current-password" />
                <button type="button" className="btn-show" onClick={()=>setShowPassword(s=>!s)} aria-label={showPassword? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="actions">
              <button className="btn-primary" type="submit" disabled={loading}>{loading? 'Ingresando...' : 'Entrar'}</button>
              <button type="button" className="btn-ghost" onClick={()=>window.location.pathname = '/forgot'}>Olvidé mi contraseña</button>
            </div>
          </form>

          <div className="card-footer">
            <div className="login-note">¿No tienes cuenta? <button className="btn-link" onClick={()=>window.location.pathname = '/register'}>Crear cuenta</button></div>
          </div>
        </div>
      </div>
    </div>
  );
}
