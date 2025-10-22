import React, {useState, useContext, useEffect} from 'react';
import { login } from '../services/auth';
import Alert from '../components/Alert';
import { AuthContext } from '../context/AuthContext';
import './login.css';

export default function Login({onSuccess}){
  const [form, setForm] = useState({email:'',password:''});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const { setToken, setUser } = useContext(AuthContext);

  function validateEmail(value){
    // simple email validation for UX (real validation still on server)
    const re = /^\S+@\S+\.\S+$/;
    return re.test(String(value).toLowerCase());
  }

  function onChange(e){
    const { name, value } = e.target;
    setForm({...form,[name]:value});
    if(name === 'email'){
      const valid = validateEmail(value);
      setEmailValid(valid);
      if(!valid && value.length > 0) setFieldErrors(f=>({...f, email: 'Formato de correo inválido'}));
      else setFieldErrors(f=>({...f, email: ''}));
    }
  }

  async function onSubmit(e){
    e.preventDefault();
    setAlert(null);
    // front-end checks
    const errors = {};
    if(!form.email) errors.email = 'Completa el correo';
    else if(!validateEmail(form.email)) errors.email = 'Formato de correo inválido';
    if(!form.password) errors.password = 'Completa la contraseña';
    if(Object.keys(errors).length){ setFieldErrors(errors); setAlert({type:'error',message:'Corrige los errores del formulario'}); return; }
    setFieldErrors({});
    setLoading(true);
    // invisible captcha hook (no-op by default, replace with real implementation)
    async function verifyCaptcha(){
      // placeholder for invisible captcha / token-based antibrute protection
      return null;
    }
    const captchaToken = await verifyCaptcha();
  try{
    const data = await login({email:form.email,password:form.password});
    setToken(data.token);
    if(setUser && data.user) setUser(data.user);
    setAlert({type:'success',message:'Ingreso exitoso'});
    if(typeof onSuccess === 'function') onSuccess();
  }catch(err){
      // Map common server errors to field-level messages when possible
      const message = err?.message || 'Error en login';
      setAlert({type:'error',message});
      if(err && err.status === 401){
        setFieldErrors({password: 'Credenciales incorrectas'});
      }
    }finally{ setLoading(false); }
  }

  return (
    <div className="login-page">
      <div className="login-wrap">
        <div className="brand">
          <div className="logo" aria-hidden>
            <div className="logo-inner">D</div>
          </div>
          <div className="title">Inicia sesión</div>
          <div className="subtitle">Accede con tu cuenta institucional</div>
        </div>

        <div className="card">
          {alert && <Alert {...alert} onClose={()=>setAlert(null)} />}
          <form onSubmit={onSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Correo</label>
              <input id="email" name="email" value={form.email} onChange={onChange} onBlur={()=>setEmailTouched(true)} placeholder="usuario@correounivalle.edu.co" autoComplete="email" aria-invalid={!!fieldErrors.email} aria-describedby={fieldErrors.email? 'email-error' : undefined} />
              {fieldErrors.email && <div className="field-error" id="email-error">{fieldErrors.email}</div>}
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <div style={{position:'relative'}}>
                <input id="password" name="password" type={showPassword? 'text' : 'password'} value={form.password} onChange={onChange} autoComplete="current-password" aria-invalid={!!fieldErrors.password} aria-describedby={fieldErrors.password? 'password-error' : undefined} />
                <button type="button" className="btn-show" onClick={()=>setShowPassword(s=>!s)} aria-label={showPassword? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={showPassword}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
                {fieldErrors.password && <div className="field-error" id="password-error">{fieldErrors.password}</div>}
              </div>
            </div>

            <div className="actions">
              <button className="btn-primary" type="submit" disabled={loading || !emailValid}>{loading? 'Ingresando...' : 'Entrar'}</button>
              <button type="button" className="btn-ghost" onClick={()=>window.location.pathname = '/forgot'}>Olvidé mi contraseña</button>
            </div>
          </form>

          <div className="card-footer">
            <div className="login-note">¿No tienes cuenta? <button className="btn-link" onClick={()=>window.location.pathname = '/register'}>Crear cuenta</button></div>
          </div>
        </div>
      </div>
    </div>
  );
}
