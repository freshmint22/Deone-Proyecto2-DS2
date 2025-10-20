import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getMe, updateMe } from '../services/user';

export default function Profile(){
  const { token, user, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(()=>{
    async function load(){
      if(!token) return;
      try{
        const res = await getMe(token);
        const data = res?.data || res;
        setForm({ name: data.nombre || data.name || '', email: data.email || '', password: '' });
        if(setUser) setUser(data);
      }catch(err){
        setMessage({ type:'error', text: err.message });
      }
    }
    load();
  },[token]);

  function onChange(e){ setForm({...form,[e.target.name]: e.target.value }); }

  async function submit(e){
    e && e.preventDefault();
    setLoading(true); setMessage(null);
    try{
      const payload = { nombre: form.name };
      if(form.password) payload.password = form.password;
      const res = await updateMe(token, payload);
      const data = res?.data || res;
      setMessage({ type:'success', text: 'Perfil actualizado' });
      if(setUser) setUser(data);
      setForm(f=>({ ...f, password: '' }));
    }catch(err){ setMessage({ type:'error', text: err.message }); }
    finally{ setLoading(false); }
  }

  if(!token) return <div className="content"><h3>Perfil</h3><p>Debes iniciar sesión para ver tu perfil.</p></div>;

  return (
    <div className="content" style={{maxWidth:640}}>
      <h3>Perfil</h3>
      {message && <div style={{color: message.type==='error'? 'crimson':'green'}}>{message.text}</div>}
      <form onSubmit={submit} style={{display:'grid',gap:8}}>
        <label>Nombre</label>
        <input name="name" value={form.name} onChange={onChange} />
        <label>Email</label>
        <input name="email" value={form.email} disabled />
        <label>Nueva contraseña (opcional)</label>
        <input name="password" type="password" value={form.password} onChange={onChange} />
        <div style={{display:'flex',gap:8}}>
          <button className="btn" type="submit" disabled={loading}>{loading? 'Guardando...':'Guardar'}</button>
        </div>
      </form>
    </div>
  );
}
