import React, {createContext, useEffect, useState} from 'react';
import { logout as serviceLogout } from '../services/auth';

export const AuthContext = createContext({token:null,setToken:()=>{},logout:()=>{}});

export function AuthProvider({children}){
  const [token, setTokenState] = useState(()=> localStorage.getItem('deone_token'));

  useEffect(()=>{
    if(token) localStorage.setItem('deone_token', token);
    else localStorage.removeItem('deone_token');
  },[token]);

  function setToken(t){ setTokenState(t); }
  function logout(){ setTokenState(null); serviceLogout(); }

  return (
    <AuthContext.Provider value={{token,setToken,logout}}>
      {children}
    </AuthContext.Provider>
  );
}
