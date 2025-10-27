// Servicio básico para llamadas al backend
// Prefer build-time VITE_API_URL, otherwise try a runtime fallback:
// - if running on localhost, default to http://localhost:4000
// - otherwise try window.location.origin (useful when backend is proxied)
// Default to the deployed backend on Render when not on localhost and VITE_API_URL is undefined
const RENDER_BACKEND = 'https://deone-proyecto2-ds2.onrender.com';
const RUNTIME_FALLBACK = (typeof window !== 'undefined' && window.location) ?
  (window.location.hostname === 'localhost' ? 'http://localhost:4000' : RENDER_BACKEND) :
  'http://localhost:4000';
export const API_BASE = import.meta.env.VITE_API_URL || RUNTIME_FALLBACK;

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

// getProducts optionally accepts a `query` string to filter by product name (server supports `name` query param)
export async function getProducts(query){
  const url = query ? `${API_BASE}/api/products?name=${encodeURIComponent(query)}` : `${API_BASE}/api/products`;
  const json = await safeFetch(url);
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

export async function updateOrderStatus(id,status, token){
  const headers = {'Content-Type':'application/json'};
  if(token) headers.Authorization = `Bearer ${token}`;
  return await safeFetch(`${API_BASE}/api/orders/${id}/status`,{
    method:'PATCH',
    headers,
    body:JSON.stringify({status})
  });
}

// Merchant/admin product management endpoints
export async function createProductAdmin(token, payload){
  return await safeFetch(`${API_BASE}/api/products/admin`,{
    method:'POST',
    headers:{'Content-Type':'application/json', Authorization: `Bearer ${token}`},
    body:JSON.stringify(payload)
  });
}

export async function updateProductAdmin(token, id, payload){
  return await safeFetch(`${API_BASE}/api/products/admin/${id}`,{
    method:'PUT',
    headers:{'Content-Type':'application/json', Authorization: `Bearer ${token}`},
    body:JSON.stringify(payload)
  });
}

export async function deleteProductAdmin(token, id){
  return await safeFetch(`${API_BASE}/api/products/admin/${id}`,{
    method:'DELETE',
    headers:{ Authorization: `Bearer ${token}` }
  });
}

// Get orders assigned to authenticated merchant
export async function getMerchantOrders(token){
  return await safeFetch(`${API_BASE}/api/orders/merchant`,{
    method:'GET',
    headers:{ Authorization: `Bearer ${token}` }
  });
}
