import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import { AuthContext } from '../context/AuthContext';
import Alert from '../components/Alert';

export default function Landing({onLogin, onRegister}){
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  function onChange(e){ setForm({...form,[e.target.name]:e.target.value}); }

  async function submit(e){
    e && e.preventDefault();
    setAlert(null);
    if(!form.email || !form.password){ setAlert({type:'error',message:'Completa email y contraseña'}); return; }
    setLoading(true);
    try{
      const data = await login(form);
      setToken(data.token);
      setAlert({type:'success',message:'Ingreso exitoso'});
  // navigate into app
  navigate('/app');
    }catch(err){
      setAlert({type:'error',message: err?.message || 'Error en login'});
    }finally{ setLoading(false); }
  }

  return (
    <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{maxWidth:980,width:'100%',display:'flex',gap:24,alignItems:'center'}}>
        <div style={{flex:1,background:'#fff',padding:24,borderRadius:10,boxShadow:'0 6px 18px rgba(0,0,0,0.06)'}}>
          <h1 style={{marginTop:0}}>Bienvenido a Deone</h1>
          <p>Compra y recibe tus productos rápido. Accede con tu cuenta estudiantil para ver ofertas exclusivas.</p>

          {alert && <Alert {...alert} onClose={()=>setAlert(null)} />}

          <form onSubmit={submit} style={{marginTop:12,display:'grid',gap:8,maxWidth:420}}>
            <input name="email" placeholder="Email" value={form.email} onChange={onChange} style={{padding:10,borderRadius:6,border:'1px solid #e6e6e6'}} />
            <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={onChange} style={{padding:10,borderRadius:6,border:'1px solid #e6e6e6'}} />
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <button className="btn" type="submit" disabled={loading}>{loading? 'Ingresando...':'Ingresar'}</button>
              <a onClick={(e)=>{ e.preventDefault(); navigate('/forgot'); }} style={{fontSize:13,cursor:'pointer'}}>Olvidé mi contraseña</a>
            </div>
          </form>

          <div style={{marginTop:16}}>
            <span>¿No tienes cuenta? </span>
            <button className="btn ghost" onClick={()=>{ if(onRegister) onRegister(); else navigate('/register'); }}>Crear cuenta</button>
          </div>
        </div>

        <div style={{width:380}}>
          {/* Use an embedded data URL to guarantee the promo image renders even if the public file is inaccessible or corrupted */}
          <div style={{width:'100%',height:220,display:'flex',alignItems:'center',justifyContent:'center',background:'#f2f2f2',borderRadius:8,color:'#666'}}>Imagen promocional deshabilitada</div>
        </div>
      </div>
    </div>
  );
}
