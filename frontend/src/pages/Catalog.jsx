import React, {useEffect, useState} from 'react';
import { getProducts } from '../services/api';
import ProductList from '../components/ProductList';

export default function Catalog(){
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(()=>{ fetchProducts(); },[]);

  async function fetchProducts(){
    setLoading(true); setError(null);
    try{
      const data = await getProducts();
      setProducts(data || []);
    }catch(err){ setError(err.message || 'Error al cargar productos'); }
    finally{ setLoading(false); }
  }

  const categories = Array.from(new Set(products.map(p=>p.category).filter(Boolean)));

  const filtered = products.filter(p=>{
    if(query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
    if(category && p.category !== category) return false;
    if(maxPrice){ const mp = parseFloat(maxPrice); if(isFinite(mp) && p.price > mp) return false; }
    return true;
  });

  return (
    <div style={{padding:20}}>
      <h2>Catálogo</h2>
      <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:12}}>
        <input placeholder="Buscar por nombre" value={query} onChange={e=>setQuery(e.target.value)} />
        <select value={category} onChange={e=>setCategory(e.target.value)}>
            <option value="">Todo</option>
          {categories.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
        <input placeholder="Precio máximo" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} style={{width:120}} />
        <button onClick={()=>{ setQuery(''); setCategory(''); setMaxPrice(''); }}>Limpiar</button>
      </div>

      {loading && <div>Cargando...</div>}
      {error && <div style={{color:'red'}}>{error}</div>}
      {!loading && !error && <ProductList products={filtered} />}
    </div>
  );
}
