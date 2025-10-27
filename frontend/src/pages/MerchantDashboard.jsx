import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getProducts, createProductAdmin, updateProductAdmin, deleteProductAdmin, getMerchantOrders, updateOrderStatus } from '../services/api';
import Alert from '../components/Alert';

function SimpleField({label, children}){
  return (
    <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:8}}>
      <label style={{fontSize:14}}>{label}</label>
      {children}
    </div>
  );
}

export default function MerchantDashboard(){
  const { user, token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('products'); // 'products' or 'orders'
  const [form, setForm] = useState({ nombre:'', precio:'', stock:10, imagen:'', descripcion:'', categoria: user?.category || '' });
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(()=>{ fetchProducts(); fetchOrders(); },[user && user.category]);

  async function fetchProducts(){
    try{
      setLoading(true);
      const all = await getProducts();
      // filter by merchant category if available
      const filtered = user?.category ? all.filter(p => String(p.categoria || '') === String(user.category || '')) : all;
      setProducts(filtered);
    }catch(e){ setNotice({type:'error', message: e.message || 'Error cargando productos'}); }
    finally{ setLoading(false); }
  }

  async function fetchOrders(){
    if(!token) return;
    try{
      const res = await getMerchantOrders(token);
      setOrders(res.data || []);
    }catch(e){ /* gracefully ignore, show empty */ }
  }

  async function handleCreateOrUpdate(e){
    e.preventDefault();
    try{
      setLoading(true);
      const payload = { ...form, precio: Number(form.precio), stock: Number(form.stock) };
      let res;
      if(editingId){
        res = await updateProductAdmin(token, editingId, payload);
        setNotice({type:'success', message:'Producto actualizado'});
        // update local state
        const updated = res?.data || res;
        setProducts(prev => prev.map(p => (String(p._id) === String(editingId) ? updated : p)));
      } else {
        res = await createProductAdmin(token, payload);
        setNotice({type:'success', message:'Producto creado'});
        // prepend created product to UI list
        const created = res?.data || res;
        if(created) setProducts(prev => [created, ...prev]);
      }
      setForm({ nombre:'', precio:'', stock:10, imagen:'', descripcion:'', categoria: user?.category || '' });
      setEditingId(null);
    }catch(err){ setNotice({type:'error', message: err.message || 'Error'}); }
    finally{ setLoading(false); setTimeout(()=>setNotice(null),2000); }
  }

  async function handleEdit(p){ setEditingId(p._id); setForm({ nombre:p.nombre||'', precio:p.precio||0, stock:p.stock||0, imagen:p.imagen||'', descripcion:p.descripcion||'', categoria:p.categoria||user?.category||'' }); setMode('products'); }

  async function handleEdit(p){
    // only allow editing if product belongs to this merchant or user is admin
    const owned = p.merchantId && user && user.id && String(p.merchantId) === String(user.id);
    if(!owned && user.role !== 'admin'){
      setNotice({ type: 'error', message: 'No autorizado para editar este producto' });
      setTimeout(()=>setNotice(null),2000);
      return;
    }
    setEditingId(p._id);
    setForm({ nombre:p.nombre||'', precio:p.precio||0, stock:p.stock||0, imagen:p.imagen||'', descripcion:p.descripcion||'', categoria:p.categoria||user?.category||'' });
    setMode('products');
  }

  async function handleDelete(id, p){
    if(!confirm('Eliminar producto?')) return;
    const owned = p.merchantId && user && user.id && String(p.merchantId) === String(user.id);
    if(!owned && user.role !== 'admin'){
      setNotice({ type: 'error', message: 'No autorizado para eliminar este producto' });
      setTimeout(()=>setNotice(null),2000);
      return;
    }
    try{
      const res = await deleteProductAdmin(token,id);
      setNotice({type:'success', message:'Producto eliminado'});
      // remove from local state
      setProducts(prev => prev.filter(x => String(x._id) !== String(id)));
    }catch(e){ setNotice({type:'error', message: e.message||'Error'}); }
    finally{ setTimeout(()=>setNotice(null),2000); }
  }

  async function handleChangeOrderStatus(orderId, newStatus){
    try{
      await updateOrderStatus(orderId, newStatus, token);
      setNotice({type:'success', message:'Estado actualizado'});
      fetchOrders();
    }catch(e){ setNotice({type:'error', message: e.message||'Error actualizando estado'}); }
    finally{ setTimeout(()=>setNotice(null),2000); }
  }

  if(!user || user.role !== 'comercio'){
    return (
      <div style={{padding:20}}>
        <h3>Acceso restringido</h3>
        <p>Esta sección es solo para comercios. Inicia sesión con una cuenta de comercio para acceder.</p>
      </div>
    );
  }

  return (
    <div style={{padding:16}}>
      <h2 style={{marginBottom:8}}>Panel de Comercio</h2>
      <div style={{display:'flex',gap:8,marginBottom:12}}>
        <button className="btn" onClick={()=>setMode('products')}>Productos</button>
        <button className="btn" onClick={()=>setMode('orders')}>Pedidos</button>
      </div>

      {notice && <div style={{marginBottom:8}}><Alert type={notice.type==='error'?'error':'success'} message={notice.message} /></div>}

      {mode === 'products' && (
        <div>
          <form onSubmit={handleCreateOrUpdate} style={{marginBottom:12,background:'var(--card-bg)',padding:12,borderRadius:8}}>
            <SimpleField label="Nombre">
              <input value={form.nombre} onChange={e=>setForm(f=>({...f,nombre:e.target.value}))} required style={{padding:8,borderRadius:8,width:'100%'}} />
            </SimpleField>
            <div style={{display:'flex',gap:8}}>
              <div style={{flex:1}}>
                <SimpleField label="Precio">
                  <input type="number" value={form.precio} onChange={e=>setForm(f=>({...f,precio:e.target.value}))} required style={{padding:8,borderRadius:8,width:'100%'}} />
                </SimpleField>
              </div>
              <div style={{width:120}}>
                <SimpleField label="Stock">
                  <input type="number" value={form.stock} onChange={e=>setForm(f=>({...f,stock:e.target.value}))} required style={{padding:8,borderRadius:8,width:'100%'}} />
                </SimpleField>
              </div>
            </div>
            <SimpleField label="Descripción">
              <input value={form.descripcion} onChange={e=>setForm(f=>({...f,descripcion:e.target.value}))} style={{padding:8,borderRadius:8,width:'100%'}} />
            </SimpleField>
            <SimpleField label="Imagen (subir desde PC)">
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <input type="file" accept="image/*" onChange={async (e)=>{
                  const file = e.target.files && e.target.files[0];
                  if(!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    const data = reader.result;
                    // store data URL (base64) in imagen field
                    setForm(f=>({...f, imagen: data}));
                  };
                  reader.readAsDataURL(file);
                }} />
                {form.imagen && (
                  <div style={{width:80,height:60,overflow:'hidden',borderRadius:6,border:'1px solid #eee'}}>
                    <img src={form.imagen} alt="preview" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                  </div>
                )}
              </div>
            </SimpleField>
            <div style={{display:'flex',gap:8}}>
              <button className="btn" type="submit" disabled={loading}>{editingId? 'Guardar cambios' : 'Crear producto'}</button>
              {editingId && <button type="button" className="btn-ghost" onClick={()=>{ setEditingId(null); setForm({ nombre:'', precio:'', stock:10, imagen:'', descripcion:'', categoria: user?.category || '' }); }}>Cancelar</button>}
            </div>
          </form>

          <div>
            <h3>Productos ({products.length})</h3>
            {loading && <p>Cargando...</p>}
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {products.map(p=> (
                <div key={p._id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:10,background:'var(--card-bg)',borderRadius:8}}>
                  <div>
                    <strong>{p.nombre}</strong>
                    <div style={{fontSize:13,color:'var(--muted)'}}>{p.categoria} — {p.descripcion}</div>
                    <div style={{fontSize:13}}>{new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(p.precio || 0)} • stock: {p.stock}</div>
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    {(p.merchantId && user && String(p.merchantId) === String(user.id)) || user.role === 'admin' ? (
                      <>
                        <button className="pill" onClick={()=>handleEdit(p)}>Editar</button>
                        <button className="pill-destructive" onClick={()=>handleDelete(p._id, p)}>Eliminar</button>
                      </>
                    ) : (
                      <div style={{fontSize:13,color:'var(--muted)'}}>Sin permisos para editar</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {mode === 'orders' && (
        <div>
          <h3>Pedidos entrantes ({orders.length})</h3>
          {orders.length === 0 && <p>No hay pedidos asignados aún.</p>}
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {orders.map(o=> (
              <div key={o._id} style={{padding:12,background:'var(--card-bg)',borderRadius:8}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
                  <div>
                    <div><strong>Pedido {o._id}</strong> — {o.status}</div>
                    <div style={{fontSize:13,color:'var(--muted)'}}>Total: {new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP'}).format(o.total || 0)}</div>
                    <div style={{fontSize:13,color:'var(--muted)'}}>Items:</div>
                    <ul>
                      {o.items && o.items.map(it => (
                        <li key={it._id}>{it.quantity} x {it.product?.nombre || it.product} — {new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP'}).format(it.price || 0)}</li>
                      ))}
                    </ul>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:8}}>
                    {o.status !== 'en_preparacion' && <button className="btn" onClick={()=>handleChangeOrderStatus(o._id,'en_preparacion')}>Marcar en preparación</button>}
                    {o.status !== 'entregado' && <button className="btn" onClick={()=>handleChangeOrderStatus(o._id,'entregado')}>Marcar entregado</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
