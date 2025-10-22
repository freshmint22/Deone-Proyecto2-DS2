import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getMe, updateMe } from '../services/user';
import './profile.css';
import { useRef } from 'react';

export default function Profile(){
  const { token, user, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', direccion:'', avatarUrl:'' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [editing, setEditing] = useState(false);
  const avatarInputRef = useRef(null);

  async function handleAvatarUpload(file){
    if(!file) return;
    try{
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await fetch(`${window.location.origin.replace(window.location.hostname, window.location.hostname==='localhost' ? 'localhost:4000' : window.location.hostname)}${window.location.port ? ':'+window.location.port : ''}/api/users/upload-avatar`,{
        method: 'POST',
        body: formData
      });
      const json = await res.json();
      if(!res.ok) throw new Error(json?.message || 'Upload failed');
      setForm(f=>({ ...f, avatarUrl: json.url }));
    }catch(e){
      setMessage({ type:'error', text: 'Error subiendo avatar' });
    }
  }

  useEffect(()=>{
    async function load(){
      if(!token) return;
      try{
        const res = await getMe(token);
        const data = res?.data || res;
        setForm({
          name: data.nombre || data.name || '',
          email: data.email || '',
          password: '',
          phone: data.phone || '',
          direccion: data.direccion || '',
          avatarUrl: data.avatarUrl || ''
        });
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
  if(form.phone) payload.phone = form.phone;
  if(form.direccion) payload.direccion = form.direccion;
  if(form.avatarUrl) payload.avatarUrl = form.avatarUrl;
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
    <div className="content">
      <div className="profile-wrap">
        <div className="profile-header">
          <div className="avatar-box">
            {editing && form.avatarUrl ? <img src={form.avatarUrl} alt="avatar" /> : <div style={{color:'#777'}}>Avatar</div>}
          </div>
          <div className="profile-info">
            <h2>{editing ? (form.name || 'Usuario') : 'Ingresar dato'}</h2>
            <p>{editing ? form.email : 'Ingresar dato'}</p>
            <div className="stats-row">
              <div className="stat"><strong>0</strong><span>Pedidos</span></div>
              <div className="stat"><strong>0</strong><span>Favoritos</span></div>
              <div className="stat"><strong>0</strong><span>Visitas</span></div>
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
            <div className="profile-actions">
              <button className="edit-btn" onClick={()=>setEditing(s=>!s)}>{editing? 'Cancelar' : 'Editar perfil'}</button>
            </div>
            {editing && (
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <input ref={avatarInputRef} type="file" accept="image/*" style={{display:'none'}} onChange={(e)=>{ const f = e.target.files && e.target.files[0]; if(f) handleAvatarUpload(f); }} />
                <button className="edit-btn alt" onClick={()=>avatarInputRef.current && avatarInputRef.current.click()}>Subir foto</button>
              </div>
            )}
          </div>
        </div>
        {message && <div style={{color: message.type==='error'? 'crimson':'#7ed481',marginBottom:12}}>{message.text}</div>}

        <form onSubmit={submit} className="form-body">
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre</label>
              <input name="name" value={editing ? form.name : ''} onChange={onChange} disabled={!editing} placeholder={editing ? '' : 'Ingresar dato'} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" value={''} disabled placeholder={form.email || 'Ingresar dato'} />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input name="phone" value={editing ? form.phone : ''} onChange={onChange} placeholder={editing ? '(+57) 300 000 0000' : 'Ingresar dato'} disabled={!editing} />
            </div>
            <div className="form-group">
              <label>Dirección</label>
              <input name="direccion" value={editing ? form.direccion : ''} onChange={onChange} placeholder={editing ? 'Calle, ciudad, país' : 'Ingresar dato'} disabled={!editing} />
            </div>

            <div className="form-group">
              <label>Avatar</label>
              <input name="avatarUrl" value={editing ? form.avatarUrl : ''} onChange={onChange} placeholder={editing ? 'https://...' : 'Ingresar dato'} disabled={!editing} />
            </div>
            <div className="form-group">
              <label>Nueva contraseña (opcional)</label>
              <input name="password" type="password" value={form.password} onChange={onChange} disabled={!editing} placeholder={editing ? '' : 'Ingresar dato'} />
            </div>
          </div>

          <div className="actions">
            <button type="button" className="btn-secondary" onClick={()=>{ setEditing(false); setMessage(null); }} disabled={!editing}>Cancelar</button>
            <button className="btn-primary" type="submit" disabled={loading || !editing}>{loading? 'Guardando...':'Guardar cambios'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
