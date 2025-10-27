import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getMe, updateMe } from '../services/user';
import './register.css';
import './profile.css';
import CATEGORIES from '../utils/categories';
import BottomNav from '../components/BottomNav';
import { useRef } from 'react';

export default function Profile(){
  const { token, user, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', direccion:'', avatarUrl:'', studentCode:'', dob:'', role:'estudiante', category:'', storeName: '' });
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
        // normalize role values coming from backend or legacy clients
        let role = data.role || 'estudiante';
        if(role === 'student') role = 'estudiante';
        if(role === 'commerce') role = 'comercio';
        setForm({
          name: data.nombre || data.name || '',
          email: data.email || '',
          password: '',
          phone: data.phone || '',
          direccion: data.direccion || '',
          avatarUrl: data.avatarUrl || '',
          studentCode: data.studentCode || data.student_id || '',
          dob: data.dob || '',
          role,
          category: data.category || '',
          storeName: data.storeName || data.storeName || ''
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
  // include role-specific fields
  if(form.role) payload.role = form.role;
  if(form.role === 'comercio' && form.category) payload.category = form.category;
  if(form.role === 'comercio' && form.storeName) payload.storeName = form.storeName;
  if(form.role === 'estudiante' && form.studentCode) payload.studentCode = form.studentCode;
  if(form.role === 'estudiante' && form.dob) payload.dob = form.dob;
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
    <div className="register-page profile-page">
      <div className="profile-wrap register-layout">
        <aside className="promo">
          <div className="promo-inner">
            <div className="promo-badge">Perfil</div>
            <h1 className="promo-title">Tu cuenta en <span className="promo-deone">DeOne</span></h1>
            <p className="promo-desc">Mantén tu información actualizada para recibir tus pedidos sin problemas. Doble clic en el nombre o correo para editar.</p>

            <div className="promo-features">
              <div className="feature">
                <div className="feature-icon">📦</div>
                <div className="feature-body">
                  <div className="feature-title">Historial de pedidos</div>
                  <div className="feature-sub">Accede rápidamente a tus compras</div>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">🔒</div>
                <div className="feature-body">
                  <div className="feature-title">Seguridad</div>
                  <div className="feature-sub">Cambia tu contraseña cuando quieras</div>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon">🏷️</div>
                <div className="feature-body">
                  <div className="feature-title">Ofertas personalizadas</div>
                  <div className="feature-sub">Recibe descuentos basados en tu actividad</div>
                </div>
              </div>
            </div>

            <div className="promo-stats bottom-stats">
              <div className="stat"><strong>Pedidos</strong><span>{/* dynamic count could go here */}</span></div>
              <div className="stat"><strong>Favoritos</strong><span>—</span></div>
              <div className="stat"><strong>Visitas</strong><span>—</span></div>
            </div>
          </div>
        </aside>

        <div className="register-wrap">
          <div className="profile-header" style={{display:'flex',gap:18,alignItems:'center'}}>
            <div className="avatar-box" style={{width:110,height:110,borderRadius:999,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'}}>
              {form.avatarUrl ? <img src={form.avatarUrl} alt="avatar" style={{width:'100%',height:'100%',objectFit:'cover'}} /> : <div style={{color:'#777'}}>Avatar</div>}
            </div>
            <div style={{flex:1}} className="profile-info">
              {form.role === 'comercio' && form.storeName ? (
                <div>
                  <h1 style={{margin:0,fontSize:28}} onDoubleClick={()=>{ setEditing(true); }}>{form.storeName}</h1>
                  <div style={{color:'var(--muted)',marginTop:6}} onDoubleClick={()=>{ setEditing(true); }}>{form.name || form.email}</div>
                </div>
              ) : (
                <>
                  <h2 onDoubleClick={()=>{ setEditing(true); }}>{form.name || 'Usuario'}</h2>
                  <p onDoubleClick={()=>{ setEditing(true); }}>{form.email || ' — '}</p>
                </>
              )}
              <div className="stats-row" style={{display:'flex',gap:12,marginTop:8}}>
                <div className="stat"><strong>0</strong><span>Pedidos</span></div>
                <div className="stat"><strong>0</strong><span>Favoritos</span></div>
                <div className="stat"><strong>0</strong><span>Visitas</span></div>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
              {editing && (
                <div style={{display:'flex',gap:8,alignItems:'center'}}>
                  <input ref={avatarInputRef} type="file" accept="image/*" style={{display:'none'}} onChange={(e)=>{ const f = e.target.files && e.target.files[0]; if(f) handleAvatarUpload(f); }} />
                  <button className="edit-btn alt" onClick={()=>avatarInputRef.current && avatarInputRef.current.click()}>Subir foto</button>
                </div>
              )}
              <div className="profile-actions" style={{marginTop:8}}>
                {/* replicate /app pills: Pedidos, Seguimiento, Perfil, Salir */}
                <ProfileActions />
              </div>
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
                <label>Tipo de cuenta</label>
                <div style={{display:'flex',gap:8}}>
                  <input type="text" value={form.role || 'estudiante'} disabled style={{background:'transparent',border:'0',color:'var(--muted)'}} />
                </div>
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input name="phone" value={editing ? form.phone : ''} onChange={onChange} placeholder={editing ? '(+57) 300 000 0000' : 'Ingresar dato'} disabled={!editing} />
              </div>
              <div className="form-group">
                <label>Dirección</label>
                <input name="direccion" value={editing ? form.direccion : ''} onChange={onChange} placeholder={editing ? 'Calle, ciudad, país' : 'Ingresar dato'} disabled={!editing} />
              </div>

              {form.role === 'estudiante' && (
                <>
                  <div className="form-group">
                    <label>Código estudiantil</label>
                    <input name="studentCode" value={editing ? form.studentCode : ''} onChange={onChange} placeholder={editing ? '' : (form.studentCode || 'Ingresar dato')} disabled={!editing} />
                  </div>
                  <div className="form-group">
                    <label>Fecha de nacimiento</label>
                    <input name="dob" type="date" value={editing ? form.dob : (form.dob || '')} onChange={onChange} disabled={!editing} />
                  </div>
                </>
              )}

              {form.role === 'comercio' && (
                <div className="form-group">
                  <label>Categoría del comercio</label>
                  {editing ? (
                    <select name="category" value={form.category} onChange={onChange}>
                      <option value="">Selecciona una categoría</option>
                      {CATEGORIES.map(c=> (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  ) : (
                    <input name="category" value={form.category || ''} disabled />
                  )}
                </div>
              )}
              {form.role === 'comercio' && (
                <div className="form-group">
                  <label>Nombre del comercio</label>
                  <input name="storeName" value={editing ? form.storeName : (form.storeName || '')} onChange={onChange} disabled={!editing} placeholder={editing ? 'Nombre del comercio' : (form.storeName || '')} />
                </div>
              )}

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
    </div>
  );
}

// render bottom nav on profile (mobile) so users have consistent navigation
export function ProfileWithNav(props){
  const navigate = useNavigate();
  // Wrap profile and bottom nav inside .app-shell so bottom-nav uses the same scoped styles as /app
  return (
    <div className="app-shell profile-shell" style={{minHeight: '100vh'}}>
      <div style={{paddingBottom:72}}>
        <Profile {...props} />
      </div>
      <BottomNav
        onHome={()=>navigate('/app')}
        onOpenSearch={()=>navigate('/app')}
        onOpenCart={()=>navigate('/app')}
        onOpenMenu={()=>navigate('/profile')}
      />
    </div>
  );
}

function ProfileActions(){
  const navigate = useNavigate();
  const { logout, token } = useContext(AuthContext);
  return (
    <div style={{display:'flex',gap:8}}>
      <button className="pill" onClick={()=>{ navigate('/app'); try{ localStorage.setItem('openOrders','1'); }catch(e){} }}>Pedidos</button>
      <button className="pill" onClick={()=>{ navigate('/app'); try{ localStorage.setItem('openTracker','1'); }catch(e){} }}>Seguimiento</button>
      <button className="pill" onClick={()=>{ navigate('/profile'); }}>Perfil</button>
      {token ? <button className="pill" onClick={()=>{ logout(); navigate('/'); }}>Salir</button> : <button className="pill" onClick={()=>navigate('/login')}>Ingresar</button>}
    </div>
  );
}
