import React, {useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth';
import Alert from '../components/Alert';
import './register.css';
import { API_BASE } from '../services/api';

const institucionalDomain = 'correounivalle.edu.co'; // Debe coincidir con validación backend

export default function Register(){
  const navigate = useNavigate();
  const [form, setForm] = useState({firstName:'',lastName:'',email:'',password:'',confirm:'',studentCode:'',dob:'',avatarUrl:''});
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  function onChange(e){
    setForm({...form,[e.target.name]:e.target.value});
  }

  function validate(){
    if(!form.firstName.trim()) return 'El nombre es obligatorio';
    if(!form.lastName.trim()) return 'El apellido es obligatorio';
    if(!form.email.includes('@') || !form.email.endsWith(institucionalDomain)) return 'Usa tu correo institucional';
    if(form.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    if(form.password !== form.confirm) return 'Las contraseñas no coinciden';
    return null;
  }

  async function onSubmit(e){
    e.preventDefault();
    const v = validate();
    if(v){ setAlert({type:'error',message:v}); return; }
    setLoading(true);
    try{
      const payload = { firstName: form.firstName, lastName: form.lastName, name: (form.firstName + ' ' + form.lastName).trim(), email: form.email, password: form.password };
  if (form.studentCode) payload.studentCode = form.studentCode;
  if (form.dob) payload.dob = form.dob;
      if (form.avatarUrl) payload.avatarUrl = form.avatarUrl;
      const data = await register(payload);
      setAlert({type:'success',message:'Registro exitoso. Revisa tu correo para confirmar.'});
      setForm({firstName:'',lastName:'',email:'',password:'',confirm:'',studentCode:'',dob:'',avatarUrl:''});
    }catch(err){
      const message = err?.message || 'Error en registro';
      setAlert({type:'error',message});
    }finally{ setLoading(false); }
  }

  async function handleAvatarUpload(file){
    if(!file) return;
    try{
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await fetch(`${API_BASE}/api/users/upload-avatar`, { method: 'POST', body: formData });
      const json = await res.json().catch(()=>({}));
      if(!res.ok) throw new Error(json?.message || 'Upload failed');
      setForm(f=>({ ...f, avatarUrl: json.url }));
    }catch(e){
      setAlert({ type:'error', message: 'Error subiendo la imagen' });
    }
  }

  return (
    <div className="register-page">
      <div className="register-wrap">
      <div className="brand">
        <div className="logo" style={{position:'relative',width:88,height:88,borderRadius:88,overflow:'hidden',background:'#0f1112',display:'flex',alignItems:'center',justifyContent:'center'}}>
          {/* Avatar upload moved here; input hidden and button overlays the circle */}
          {form.avatarUrl ? <img src={form.avatarUrl} alt="avatar" style={{width:'100%',height:'100%',objectFit:'cover'}} /> : <div style={{color:'#777'}}> </div>}
          <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={(e)=>{ const f = e.target.files && e.target.files[0]; if(f) handleAvatarUpload(f); }} />
          <button type="button" className="btn-ghost" onClick={()=>fileRef.current && fileRef.current.click()} style={{position:'absolute',right:6,bottom:6,background:'rgba(0,0,0,0.45)',borderRadius:8,padding:'6px 10px',border:'1px solid rgba(255,255,255,0.06)',color:'var(--text)',fontSize:12}}>Subir foto</button>
        </div>
        <div className="title">Crea tu cuenta</div>
        <div className="subtitle">Regístrate con tu correo institucional</div>
      </div>
      {alert && <Alert type={alert.type} message={alert.message} onClose={()=>setAlert(null)} />}
      <form onSubmit={onSubmit}>
        <div className="grid-2">
          <div className="form-group">
            <label>Nombre</label>
            <input name="firstName" value={form.firstName} onChange={onChange} placeholder="nombre" autoComplete="given-name" />
          </div>
          <div className="form-group">
            <label>Apellido</label>
            <input name="lastName" value={form.lastName} onChange={onChange} placeholder="apellido" autoComplete="family-name" />
          </div>
        </div>
        <div className="form-group">
          <label>Correo institucional</label>
          <input name="email" value={form.email} onChange={onChange} placeholder="usuario@correounivalle.edu.co" autoComplete="email" />
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label>Código estudiantil</label>
            <input name="studentCode" value={form.studentCode} onChange={onChange} placeholder="202560722" autoComplete="off" />
          </div>
          <div className="form-group">
            <label>Fecha de nacimiento</label>
            <input name="dob" type="date" value={form.dob} onChange={onChange} />
          </div>
        </div>
        {/* Avatar upload moved to brand above; remove duplicated avatar block here */}
        <div className="form-group">
          <label>Contraseña</label>
          <input name="password" type="password" value={form.password} onChange={onChange} autoComplete="new-password" />
        </div>
        <div className="form-group">
          <label>Confirmar contraseña</label>
          <input name="confirm" type="password" value={form.confirm} onChange={onChange} autoComplete="new-password" />
        </div>

        <div className="actions">
          <button className="btn-primary" type="submit" disabled={loading}>{loading? 'Registrando...' : 'Registrarme'}</button>
          <button type="button" className="btn-ghost" onClick={()=>navigate('/login')}>Ya tengo cuenta</button>
        </div>
        <div className="note">Al registrarte aceptas los términos y condiciones.</div>
      </form>
      </div>
    </div>
  );
}
