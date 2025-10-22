import React, {useEffect, useState} from 'react';
import { getProducts } from '../services/api';
import ProductList from '../components/ProductList';
import CategoriesRow from '../components/CategoriesRow';
import TopBrandsRow from '../components/TopBrandsRow';
import OffersSidebar from '../components/OffersSidebar';

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

  const categories = Array.from(new Set(products.map(p=>p.category || p.categoria).filter(Boolean))).slice(0,16);
  const brandsMap = new Map();
  products.forEach(p=>{
    const name = p.merchantName || p.marca || p.supplier || p.store || p.nombreComercio || p.shop || p.brand;
    if(name){ if(!brandsMap.has(name)) brandsMap.set(name, {name, logo: p.logo || p.image}); }
  });
  const brands = Array.from(brandsMap.values()).slice(0,10);

  const filtered = products.filter(p=>{
    if(query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
    if(category && p.category !== category) return false;
    if(maxPrice){ const mp = parseFloat(maxPrice); if(isFinite(mp) && p.price > mp) return false; }
    return true;
  });

  // pagination: show 16 items per page (4x4)
  const pageSize = 16;
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice(page * pageSize, (page+1) * pageSize);

  // mock promotions: derive from first products, fallback to static promotions if none
  let promotions = products.slice(0,6).map((p,i)=>({ id: p.id||p._id||i, title: p.nombre||p.name, subtitle: p.description || '', image: p.image || p.logo }));
  if(!promotions || promotions.length === 0){
    promotions = [
      { id: 'promo-1', title: 'Descuento -15% en cafés', subtitle: 'Solo hoy: aplica en comercios seleccionados', image: '/assets/placeholder-product.png' },
      { id: 'promo-2', title: 'Envío gratis (nuevos usuarios)', subtitle: 'Por 30 días - aplica condiciones', image: '/assets/placeholder-product.png' },
      { id: 'promo-3', title: 'Combo estudiante', subtitle: 'Ahorra en comidas rápidas', image: '/assets/placeholder-product.png' }
    ];
  }

  return (
    <div style={{padding:20}}>
      <h2>Catálogo</h2>

      {/* Filters row */}
      <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:12}}>
        <input placeholder="Buscar productos, comercios o categorías" value={query} onChange={e=>setQuery(e.target.value)} style={{flex:1,padding:12,borderRadius:10,border:'1px solid rgba(0,0,0,0.06)'}} />
        <button className="filter-btn">Filtrar</button>
      </div>

      {/* Categories icons row */}
      <CategoriesRow categories={categories} onSelect={(c)=>{ setCategory(c); setPage(0); }} />

      {/* Top brands */}
      <TopBrandsRow brands={brands} />

      <div style={{height:14}} />

      {/* Main content area with products and offers sidebar */}
      <div style={{display:'flex',gap:16,alignItems:'flex-start'}}>
        <div style={{flex:1}}>
          {loading && <div>Cargando...</div>}
          {error && <div style={{color:'red'}}>{error}</div>}
          {!loading && !error && (
            <>
              <ProductList products={pageItems} />

              {/* pagination controls */}
              <div style={{display:'flex',justifyContent:'center',gap:12,marginTop:18}}>
                <button className="btn ghost" onClick={()=>setPage(Math.max(0,page-1))} disabled={page===0}>Anterior</button>
                <div style={{alignSelf:'center'}}>Página {page+1} de {totalPages}</div>
                <button className="btn" onClick={()=>setPage(Math.min(totalPages-1,page+1))} disabled={page>=totalPages-1}>Siguiente</button>
              </div>
            </>
          )}
        </div>

        <OffersSidebar promotions={promotions} />
      </div>
    </div>
  );
}
