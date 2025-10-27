import React, {useState, useRef} from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth';
import Alert from '../components/Alert';
import './register.css';
import { API_BASE } from '../services/api';
import CATEGORIES from '../utils/categories';

const institucionalDomain = 'correounivalle.edu.co'; // Debe coincidir con validación backend

export default function Register(){
  const navigate = useNavigate();
  const [form, setForm] = useState({firstName:'',lastName:'',email:'',password:'',confirm:'',studentCode:'',dob:'',avatarUrl:'', role:'estudiante', category:'', storeName: ''});
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const today = new Date();
  const todayISO = today.toISOString().split('T')[0];

  function onChange(e){
    setForm({...form,[e.target.name]:e.target.value});
  }

  function validate(){
    const e = {};
    if(!form.firstName.trim()) e.firstName = 'El nombre es obligatorio';
    if(!form.lastName.trim()) e.lastName = 'El apellido es obligatorio';
    if(!form.email.includes('@') || !form.email.endsWith(institucionalDomain)) e.email = 'Usa tu correo institucional';
    if(form.studentCode && !/^\d{6,10}$/.test(form.studentCode)) e.studentCode = 'Código debe ser numérico (6-10 dígitos)';
    if(!form.password || form.password.length < 6) e.password = 'La contraseña debe tener al menos 6 caracteres';
    if(form.password !== form.confirm) e.confirm = 'Las contraseñas no coinciden';
    if(form.dob){
      const d = new Date(form.dob);
      if(isNaN(d.getTime())) e.dob = 'Fecha inválida';
      else if(d > today) e.dob = 'La fecha no puede ser en el futuro';
    }
  if(form.role === 'comercio' && !form.category) e.category = 'Indica la categoría del comercio';
  if(form.role === 'comercio' && !form.storeName?.trim()) e.storeName = 'Indica el nombre del comercio';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e){
    e.preventDefault();
    const ok = validate();
  if(!ok){ setAlert({type:'error',message:'Completa los campos adecuadamente'}); return; }
    setLoading(true);
    try{
    const payload = { firstName: form.firstName, lastName: form.lastName, name: (form.firstName + ' ' + form.lastName).trim(), email: form.email, password: form.password };
  if (form.studentCode) payload.studentCode = form.studentCode;
  if (form.dob) payload.dob = form.dob;
    if (form.avatarUrl) payload.avatarUrl = form.avatarUrl;
    // role & category
  if (form.role) payload.role = form.role;
  if (form.role === 'comercio') {
    if (form.category) payload.category = form.category;
    if (form.storeName) payload.storeName = form.storeName;
  }
      const data = await register(payload);
      // Redirect user to login after successful registration
      navigate('/login');
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
      <div className="register-layout">
        <aside className="promo">
          <div className="promo-inner">
            <div className="promo-badge">Portal Estudiantil</div>
            <h1 className="promo-title">Bienvenido a<br/><span className="promo-deone">DeOne</span></h1>
            <p className="promo-desc">Tu plataforma de pedidos en el campus.<br/>Compra sin filas, recibe notificaciones y apoya los comercios locales</p>

            <div className="promo-features">
              <div className="feature">
                <div className="feature-icon">📦</div>
                <div className="feature-body">
                  <div className="feature-title">Pedidos rápidos</div>
                  <div className="feature-sub">Ordena sin filas, ahorra tiempo</div>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">⏱️</div>
                <div className="feature-body">
                  <div className="feature-title">Seguimiento en tiempo real</div>
                  <div className="feature-sub">Conoce el estado de tu pedido al instante</div>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">🏪</div>
                <div className="feature-body">
                  <div className="feature-title">Comercios del campus</div>
                  <div className="feature-sub">Acceso a cafeterías, librerías y más</div>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">📈</div>
                <div className="feature-body">
                  <div className="feature-title">Gestión eficiente</div>
                  <div className="feature-sub">Inventarios y pedidos digitalizados</div>
                </div>
              </div>
            </div>

            <div className="promo-stats bottom-stats">
              <div className="stat"><strong>-30%</strong><span>Tiempo de espera</span></div>
              <div className="stat"><strong>20+</strong><span>Comercios disponibles</span></div>
              <div className="stat"><strong>&lt;5s</strong><span>Actualización en vivo</span></div>
            </div>
          </div>
        </aside>
        <div className="register-wrap">
          <div className="brand">
            <div className="logo" style={{position:'relative',width:88,height:88,borderRadius:88,overflow:'hidden',background:'#0f1112',display:'flex',alignItems:'center',justifyContent:'center'}}>
              {form.avatarUrl ? <img src={form.avatarUrl} alt="avatar" style={{width:'100%',height:'100%',objectFit:'cover'}} /> : <div style={{color:'#777'}} />}
              <input ref={fileRef} type="file" accept="image/*" style={{display:'none'}} onChange={(e)=>{ const f = e.target.files && e.target.files[0]; if(f) handleAvatarUpload(f); }} />
              <button type="button" className="btn-upload" onClick={()=>fileRef.current && fileRef.current.click()} aria-label="Subir foto">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M3 7h3l2-2h6l2 2h3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
              </button>
            </div>
            <div className="upload-caption">Sube tu foto</div>
            <div className="title">Crea tu cuenta</div>
            <div className="subtitle">Regístrate con tu correo institucional</div>
          </div>
          {alert && <Alert type={alert.type} message={alert.message} onClose={()=>setAlert(null)} />}
          <form onSubmit={onSubmit}>
            <div className="grid-2">
          <div className="form-group">
            <label>Nombre</label>
            <input name="firstName" className={errors.firstName? 'input-error':''} value={form.firstName} onChange={onChange} placeholder="nombre" autoComplete="given-name" />
            {errors.firstName && <small className="field-error">{errors.firstName}</small>}
          </div>
          <div className="form-group">
            <label>Apellido</label>
            <input name="lastName" className={errors.lastName? 'input-error':''} value={form.lastName} onChange={onChange} placeholder="apellido" autoComplete="family-name" />
            {errors.lastName && <small className="field-error">{errors.lastName}</small>}
          </div>
        </div>
        <div className="form-group">
          <label>Tipo de cuenta</label>
          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            <label style={{display:'flex',alignItems:'center',gap:6}}><input type="radio" name="role" value="estudiante" checked={form.role==='estudiante'} onChange={(e)=>setForm(f=>({...f,role:e.target.value}))} /> Estudiante</label>
            <label style={{display:'flex',alignItems:'center',gap:6}}><input type="radio" name="role" value="comercio" checked={form.role==='comercio'} onChange={(e)=>setForm(f=>({...f,role:e.target.value}))} /> Comercio</label>
          </div>
        </div>
  {form.role === 'comercio' && (
          <div className="form-group">
            <label>Categoría del comercio</label>
            <select name="category" value={form.category} onChange={onChange}>
              <option value="">Selecciona una categoría</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <small className="field-error">{errors.category}</small>}
          </div>
        )}
    {form.role === 'comercio' && (
            <div className="form-group">
              <label>Nombre del comercio</label>
              <input name="storeName" value={form.storeName} onChange={onChange} placeholder="Ej: Cafetería La Esquina" />
              {errors.storeName && <small className="field-error">{errors.storeName}</small>}
            </div>
          )}
        <div className="form-group">
          <label>Correo institucional</label>
          <input name="email" className={errors.email? 'input-error':''} value={form.email} onChange={onChange} placeholder="usuario@correounivalle.edu.co" autoComplete="email" />
          {errors.email && <small className="field-error">{errors.email}</small>}
        </div>
        <div className="grid-2">
          <div className="form-group">
            <label>Código estudiantil</label>
            <input name="studentCode" className={errors.studentCode? 'input-error':''} value={form.studentCode} onChange={onChange} placeholder="202560722" autoComplete="off" />
            {errors.studentCode && <small className="field-error">{errors.studentCode}</small>}
          </div>
          <div className="form-group">
            <label>Fecha de nacimiento</label>
            <input name="dob" type="date" value={form.dob} onChange={onChange} max={todayISO} />
            {errors.dob && <small className="field-error">{errors.dob}</small>}
          </div>
        </div>
        {/* Avatar upload moved to brand above; remove duplicated avatar block here */}
        <div className="form-group">
          <label>Contraseña</label>
          <div style={{position:'relative'}}>
            <input name="password" className={errors.password? 'input-error':''} type={showPassword ? 'text' : 'password'} value={form.password} onChange={onChange} autoComplete="new-password" />
            {errors.password && <small className="field-error">{errors.password}</small>}
            <button type="button" className="btn-show" onClick={()=>setShowPassword(s=>!s)} aria-label={showPassword? 'Ocultar contraseña' : 'Mostrar contraseña'}>
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12s4-7 10-7c2.08 0 3.99.45 5.66 1.22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 12s-4 7-10 7c-2.08 0-3.99-.45-5.66-1.22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
            </button>
          </div>
        </div>
        <div className="form-group">
          <label>Confirmar contraseña</label>
          <div style={{position:'relative'}}>
            <input name="confirm" className={errors.confirm? 'input-error':''} type={showConfirm ? 'text' : 'password'} value={form.confirm} onChange={onChange} autoComplete="new-password" />
            {errors.confirm && <small className="field-error">{errors.confirm}</small>}
            <button type="button" className="btn-show" onClick={()=>setShowConfirm(s=>!s)} aria-label={showConfirm? 'Ocultar contraseña' : 'Mostrar contraseña'}>
              {showConfirm ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12s4-7 10-7c2.08 0 3.99.45 5.66 1.22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 12s-4 7-10 7c-2.08 0-3.99-.45-5.66-1.22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
            </button>
          </div>
        </div>

        <div className="actions">
          <button className="btn-primary" type="submit" disabled={loading}>{loading? 'Registrando...' : 'Registrarme'}</button>
          <button type="button" className="btn-ghost" onClick={()=>navigate('/login')}>Ya tengo cuenta</button>
        </div>
  <div className="note">Al registrarte aceptas los <Link to="/terms" style={{textDecoration:'underline',color:'var(--landing-text)'}}>términos y condiciones</Link>.</div>
          </form>
        </div>
      </div>
    </div>
  );
}
