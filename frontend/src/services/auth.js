const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
