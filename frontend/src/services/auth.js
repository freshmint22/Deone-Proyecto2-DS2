const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function register(payload){
  const res = await fetch(`${API_BASE}/api/auth/register`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(payload)
  });
  const json = await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(json?.message || 'Error en registro');
  return json;
}

export async function login(payload){
  const res = await fetch(`${API_BASE}/api/auth/login`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(payload)
  });
  const json = await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(json?.message || 'Error en login');
  return json; // { token, user }
}

export function logout(){
  // cliente: limpiar token local
  localStorage.removeItem('deone_token');
}
