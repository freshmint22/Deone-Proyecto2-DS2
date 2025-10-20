import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth';
import Alert from '../components/Alert';

const institucionalDomain = 'edu.co'; // Ajusta según la institución

export default function Register(){
  const navigate = useNavigate();
  const [form, setForm] = useState({name:'',email:'',password:'',confirm:''});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  function onChange(e){
    setForm({...form,[e.target.name]:e.target.value});
  }

  function validate(){
    if(!form.name.trim()) return 'El nombre es obligatorio';
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
      const data = await register({name:form.name,email:form.email,password:form.password});
      setAlert({type:'success',message:'Registro exitoso. Revisa tu correo para confirmar.'});
      setForm({name:'',email:'',password:'',confirm:''});
    }catch(err){
      const message = err?.message || 'Error en registro';
      setAlert({type:'error',message});
    }finally{ setLoading(false); }
  }

  return (
    <div style={{maxWidth:480,margin:'24px auto'}}>
      <div style={{padding:20,background:'#fff',borderRadius:8}}>
        <h2>Registro de estudiante</h2>
        {alert && <Alert type={alert.type} message={alert.message} onClose={()=>setAlert(null)} />}
        <form onSubmit={onSubmit}>
          <div style={{marginBottom:12}}>
            <label>Nombre</label>
            <input name="name" value={form.name} onChange={onChange} style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #e6e6e6'}} />
          </div>
          <div style={{marginBottom:12}}>
            <label>Correo institucional</label>
            <input name="email" value={form.email} onChange={onChange} style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #e6e6e6'}} />
          </div>
          <div style={{marginBottom:12}}>
            <label>Contraseña</label>
            <input name="password" type="password" value={form.password} onChange={onChange} style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #e6e6e6'}} />
          </div>
          <div style={{marginBottom:12}}>
            <label>Confirmar contraseña</label>
            <input name="confirm" type="password" value={form.confirm} onChange={onChange} style={{width:'100%',padding:8,borderRadius:6,border:'1px solid #e6e6e6'}} />
          </div>
          <div style={{display:'flex',gap:8,marginTop:12}}>
            <button type="submit" disabled={loading} className="btn">{loading? 'Registrando...' : 'Registrar'}</button>
            <button type="button" className="btn ghost" onClick={()=>{ navigate('/'); }}>Regresar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
