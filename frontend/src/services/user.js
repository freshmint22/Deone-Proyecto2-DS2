import { API_BASE } from './api';

function authHeader(token){
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getMe(token){
  const res = await fetch(`${API_BASE}/api/users/me`, { headers: { 'Content-Type':'application/json', ...authHeader(token) }});
  const json = await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(json?.message || 'Error fetching profile');
  return json;
}

export async function updateMe(token, payload){
  const res = await fetch(`${API_BASE}/api/users/me`, { method:'PUT', headers: { 'Content-Type':'application/json', ...authHeader(token) }, body: JSON.stringify(payload) });
  const json = await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(json?.message || 'Error updating profile');
  return json;
}

export default { getMe, updateMe };
