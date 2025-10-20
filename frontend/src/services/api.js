// Servicio básico para llamadas al backend
// Prefer build-time VITE_API_URL, otherwise try a runtime fallback:
// - if running on localhost, default to http://localhost:4000
// - otherwise try window.location.origin (useful when backend is proxied)
const RUNTIME_FALLBACK = (typeof window !== 'undefined' && window.location) ?
  (window.location.hostname === 'localhost' ? 'http://localhost:4000' : window.location.origin) :
  'http://localhost:4000';
const API_BASE = import.meta.env.VITE_API_URL || RUNTIME_FALLBACK;

async function safeFetch(url, opts){
  try{
    const res = await fetch(url, opts);
    const text = await res.text().catch(()=>'');
    // try to parse json if any
    let json = {};
    try{ json = text ? JSON.parse(text) : {}; }catch(e){ json = { raw: text }; }
    if(!res.ok) {
      const msg = json?.message || json?.error || `HTTP ${res.status}`;
      const err = new Error(msg);
      err.status = res.status;
      throw err;
    }
    return json;
  }catch(e){
    // rethrow with a clearer message
    const err = new Error(e?.message || 'Network error al conectar con backend');
    err.cause = e;
    throw err;
  }
}

export async function getProducts(){
  const json = await safeFetch(`${API_BASE}/api/products`);
  return json?.data || [];
}

export async function createOrder(payload){
  return await safeFetch(`${API_BASE}/api/orders`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(payload)
  });
}

export async function getOrders(){
  return await safeFetch(`${API_BASE}/api/orders`);
}

export async function getOrder(id){
  return await safeFetch(`${API_BASE}/api/orders/${id}`);
}

export async function updateOrderStatus(id,status){
  return await safeFetch(`${API_BASE}/api/orders/${id}/status`,{
    method:'PATCH',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({status})
  });
}
