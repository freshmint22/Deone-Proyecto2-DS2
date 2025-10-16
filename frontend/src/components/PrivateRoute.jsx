import React, {useContext} from 'react';
import { AuthContext } from '../context/AuthContext';

// Simple private route wrapper that conditionally renders children or a message
export default function PrivateRoute({children}){
  const { token } = useContext(AuthContext);
  if(!token) return (
    <div style={{padding:20}}>
      <h3>Acceso restringido</h3>
      <p>Debes iniciar sesión para ver esta página.</p>
    </div>
  );
  return <>{children}</>;
}
