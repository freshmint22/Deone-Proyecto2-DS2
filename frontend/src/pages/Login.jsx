import React, {useState, useContext} from 'react';
import { login } from '../services/auth';
import Alert from '../components/Alert';
import { AuthContext } from '../context/AuthContext';

export default function Login(){
  const [form, setForm] = useState({email:'',password:''});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const { setToken } = useContext(AuthContext);

  function onChange(e){ setForm({...form,[e.target.name]:e.target.value}); }

  async function onSubmit(e){
    e.preventDefault();
    setAlert(null);
    if(!form.email || !form.password) { setAlert({type:'error',message:'Completa email y contraseña'}); return; }
    setLoading(true);
    try{
      const data = await login({email:form.email,password:form.password});
      setToken(data.token);
      setAlert({type:'success',message:'Ingreso exitoso'});
    }catch(err){
      setAlert({type:'error',message:err?.message || 'Error en login'});
    }finally{ setLoading(false); }
  }

  return (
    <div style={{maxWidth:420,margin:'24px auto',padding:20,background:'#fff',borderRadius:6}}>
      <h2>Iniciar sesión</h2>
      {alert && <Alert {...alert} onClose={()=>setAlert(null)} />}
      <form onSubmit={onSubmit}>
        <div style={{marginBottom:8}}>
          <label>Email</label>
          <input name="email" value={form.email} onChange={onChange} style={{width:'100%'}} />
        </div>
        <div style={{marginBottom:8}}>
          <label>Contraseña</label>
          <input name="password" type="password" value={form.password} onChange={onChange} style={{width:'100%'}} />
        </div>
        <button type="submit" disabled={loading}>{loading? 'Ingresando...' : 'Entrar'}</button>
      </form>
    </div>
  );
}
