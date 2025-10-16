// Servicio básico para llamadas al backend
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getProducts(){
  const res = await fetch(`${API_BASE}/products`);
  if(!res.ok) throw new Error('Error al obtener productos');
  return res.json();
}
