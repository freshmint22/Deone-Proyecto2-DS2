import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getMe, updateMe } from '../services/user';
import './profile.css';
import CATEGORIES from '../utils/categories';
import BottomNav from '../components/BottomNav';

export default function Profile(){
  const { token, user, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', direccion:'', studentCode:'', dob:'', role:'estudiante', category:'', storeName: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [editing, setEditing] = useState(false);
  const [originalForm, setOriginalForm] = useState(null);

  // allow Escape to cancel editing
  useEffect(()=>{
    function onKey(e){
      if(e.key === 'Escape' && editing){
        setEditing(false);
        setMessage(null);
        // revert changes when cancelling with Escape
        if(originalForm) setForm(originalForm);
      }
    }
    window.addEventListener('keydown', onKey);
    return ()=> window.removeEventListener('keydown', onKey);
  },[editing]);

  // avatar handling removed by request: no avatar UI or uploads

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
  if(form.email) payload.email = form.email;
  if(form.phone) payload.phone = form.phone;
  if(form.direccion) payload.direccion = form.direccion;
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
    <div className="profile-page">
      <div className="profile-wrap">
  <div className="register-wrap centered-edit" onDoubleClick={()=>{ if(!editing){ setOriginalForm(form); setEditing(true); } }}>
            <div className="profile-header" style={{display:'flex',gap:18,alignItems:'center'}}>
            {/* Avatar removed from header per requirements */}
            <div style={{flex:1}} className="profile-info">
              {form.role === 'comercio' && form.storeName ? (
                <div>
                  <h1 style={{margin:0,fontSize:28}} onDoubleClick={()=>{ if(!editing){ setOriginalForm(form); setEditing(true); } }}>{form.storeName}</h1>
                  <div style={{color:'var(--muted)',marginTop:6}} onDoubleClick={()=>{ if(!editing){ setOriginalForm(form); setEditing(true); } }}>{form.name || form.email}</div>
                </div>
              ) : (
                <>
                  <h2 onDoubleClick={()=>{ if(!editing){ setOriginalForm(form); setEditing(true); } }}>{form.name || 'Usuario'}</h2>
                  <p onDoubleClick={()=>{ if(!editing){ setOriginalForm(form); setEditing(true); } }}>{form.email || ' — '}</p>
                </>
              )}
              <div className="stats-row" style={{display:'flex',gap:12,marginTop:8}}>
                <div className="stat"><strong>0</strong><span>Pedidos</span></div>
                <div className="stat"><strong>0</strong><span>Favoritos</span></div>
                <div className="stat"><strong>0</strong><span>Visitas</span></div>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
              {/* no avatar/upload UI; action pills removed */}
            </div>
          </div>

          {message && <div style={{color: message.type==='error'? 'crimson':'#7ed481',marginBottom:12}}>{message.text}</div>}

          <form onSubmit={submit} className="form-body">
            <div className="form-grid">
              <div className="form-group">
                <label>Nombre</label>
                {editing ? (
                  <input name="name" value={form.name} onChange={onChange} placeholder={''} />
                ) : (
                  <div className="readonly-field" onDoubleClick={()=>{ setOriginalForm(form); setEditing(true); }}>{form.name || 'Ingresar dato'}</div>
                )}
              </div>
              <div className="form-group">
                <label>Email</label>
                {editing ? (
                  <input name="email" value={form.email || ''} onChange={onChange} placeholder={''} />
                ) : (
                  <div className="readonly-field" onDoubleClick={()=>{ setOriginalForm(form); setEditing(true); }}>{form.email || ' — '}</div>
                )}
              </div>

              <div className="form-group">
                <label>Tipo de cuenta</label>
                <div style={{display:'flex',gap:8}}>
                  <input type="text" value={form.role || 'estudiante'} disabled style={{background:'transparent',border:'0',color:'var(--muted)'}} />
                </div>
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                {editing ? (
                  <input name="phone" value={form.phone || ''} onChange={onChange} placeholder={'(+57) 300 000 0000'} />
                ) : (
                  <div className="readonly-field" onDoubleClick={()=>{ setOriginalForm(form); setEditing(true); }}>{form.phone || 'Ingresar dato'}</div>
                )}
              </div>
              <div className="form-group">
                <label>Dirección</label>
                {editing ? (
                  <input name="direccion" value={form.direccion || ''} onChange={onChange} placeholder={'Calle, ciudad, país'} />
                ) : (
                  <div className="readonly-field" onDoubleClick={()=>{ setOriginalForm(form); setEditing(true); }}>{form.direccion || 'Ingresar dato'}</div>
                )}
              </div>

              {form.role === 'estudiante' && (
                <>
                  <div className="form-group">
                    <label>Código estudiantil</label>
                    {editing ? (
                      <input name="studentCode" value={form.studentCode || ''} onChange={onChange} />
                    ) : (
                      <div className="readonly-field" onDoubleClick={()=>{ setOriginalForm(form); setEditing(true); }}>{form.studentCode || 'Ingresar dato'}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Fecha de nacimiento</label>
                    {editing ? (
                      <input name="dob" type="date" value={form.dob || ''} onChange={onChange} />
                    ) : (
                      <div className="readonly-field" onDoubleClick={()=>{ setOriginalForm(form); setEditing(true); }}>{form.dob || '—'}</div>
                    )}
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
                    <div className="readonly-field" onDoubleClick={()=>{ setOriginalForm(form); setEditing(true); }}>{form.category || '—'}</div>
                  )}
                </div>
              )}
              {form.role === 'comercio' && (
                <div className="form-group">
                  <label>Nombre del comercio</label>
                  {editing ? (
                    <input name="storeName" value={form.storeName || ''} onChange={onChange} placeholder={'Nombre del comercio'} />
                  ) : (
                    <div className="readonly-field" onDoubleClick={()=>{ setOriginalForm(form); setEditing(true); }}>{form.storeName || '—'}</div>
                  )}
                </div>
              )}

              {/* Avatar input removed per requirements (do not ask/store avatar) */}
              <div className="form-group">
                <label>Nueva contraseña (opcional)</label>
                <input name="password" type="password" value={form.password} onChange={onChange} disabled={!editing} placeholder={editing ? '' : 'Ingresar dato'} />
              </div>
            </div>

            <div className="actions">
              <button type="button" className="btn-secondary" onClick={()=>{ setEditing(false); setMessage(null); if(originalForm) setForm(originalForm); }} disabled={!editing}>Cancelar</button>
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
  const { logout, token, user } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);
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
        onOpenMenu={()=>setShowMenu(v=>!v)}
      />

      {showMenu && (
        <div style={{position:'fixed',right:12,bottom:80,background:'var(--card-bg)',border:'1px solid rgba(0,0,0,0.06)',borderRadius:8,padding:8,zIndex:3000}}>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            <button className="pill" onClick={()=>{ try{ localStorage.setItem('openOrders','1'); }catch(e){} navigate('/app'); setShowMenu(false); }}>Pedidos</button>
            <button className="pill" onClick={()=>{ try{ localStorage.setItem('openTracker','1'); }catch(e){} navigate('/app'); setShowMenu(false); }}>Seguimiento</button>
            <button className="pill" onClick={()=>{ navigate('/profile'); setShowMenu(false); }}>Perfil</button>
            {token ? (
              <>
                {user && user.role === 'comercio' && (
                  <button className="pill" onClick={()=>{ navigate('/commerce'); setShowMenu(false); }}>Ir al comercio</button>
                )}
                <button className="pill" onClick={()=>{ logout && logout(); navigate('/'); setShowMenu(false); }}>Salir</button>
              </>
            ) : (
              <button className="pill" onClick={()=>{ navigate('/login'); setShowMenu(false); }}>Ingresar</button>
            )}
          </div>
        </div>
      )}
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
