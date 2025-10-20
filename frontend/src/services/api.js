// Servicio básico para llamadas al backend
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function getProducts(){
  const res = await fetch(`${API_BASE}/api/products`);
  const json = await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(json?.message || 'Error al obtener productos');
  // backend returns { success: true, data: [...] }
  return json?.data || [];
}

export async function createOrder(payload){
  const res = await fetch(`${API_BASE}/api/orders`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(payload)
  });
  const json = await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(json?.message || 'Error creando pedido');
  return json;
}

export async function getOrders(){
  const res = await fetch(`${API_BASE}/api/orders`);
  const json = await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(json?.message || 'Error obteniendo pedidos');
  return json;
}

export async function getOrder(id){
  const res = await fetch(`${API_BASE}/api/orders/${id}`);
  const json = await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(json?.message || 'Error obteniendo pedido');
  return json;
}

export async function updateOrderStatus(id,status){
  const res = await fetch(`${API_BASE}/api/orders/${id}/status`,{
    method:'PATCH',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({status})
  });
  const json = await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(json?.message || 'Error actualizando estado');
  return json;
}
