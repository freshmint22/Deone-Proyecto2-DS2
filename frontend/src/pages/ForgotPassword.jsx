import React, {useState} from 'react';
import Alert from '../components/Alert';
import { API_BASE } from '../services/api';

// We'll call backend /api/auth/forgot via fetch helper
export default function ForgotPassword(){
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  async function submit(e){
    e.preventDefault();
    setAlert(null);
    if(!email) { setAlert({type:'error',message:'Ingresa tu email'}); return; }
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
    <div style={{maxWidth:520,margin:'48px auto',padding:20,background:'#fff',borderRadius:8}}>
      <h2>Recuperar contraseña</h2>
      {alert && <Alert {...alert} onClose={()=>setAlert(null)} />}
      <form onSubmit={submit} style={{display:'grid',gap:8}}>
        <input placeholder="Tu email" value={email} onChange={e=>setEmail(e.target.value)} style={{padding:8,borderRadius:6,border:'1px solid #e6e6e6'}} />
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <button className="btn" type="submit" disabled={loading}>{loading? 'Enviando...':'Enviar email'}</button>
          <a href="/" style={{fontSize:13}}>Volver</a>
        </div>
      </form>
    </div>
  );
}
