import React, {createContext, useEffect, useState} from 'react';
import { logout as serviceLogout } from '../services/auth';

// AuthContext now exposes token and user and helpers to set both
export const AuthContext = createContext({
  token: null,
  user: null,
  setToken: ()=>{},
  setUser: ()=>{},
  logout: ()=>{}
});

export function AuthProvider({children}){
  const [token, setTokenState] = useState(()=> localStorage.getItem('deone_token'));
  const [user, setUserState] = useState(()=> {
    try{
      const raw = localStorage.getItem('deone_user');
      return raw ? JSON.parse(raw) : null;
    }catch(e){ return null; }
  });

  useEffect(()=>{
    if(token) localStorage.setItem('deone_token', token);
    else localStorage.removeItem('deone_token');
  },[token]);

  useEffect(()=>{
    if(user) localStorage.setItem('deone_user', JSON.stringify(user));
    else localStorage.removeItem('deone_user');
  },[user]);

  function setToken(t){ setTokenState(t); }
  function setUser(u){ setUserState(u); }
  function logout(){
    setTokenState(null);
    setUserState(null);
    try{ serviceLogout(); }catch(e){ /* ignore logout service errors */ }
    // Redirect to login page after clearing auth state.
    // Prefer SPA navigation by using history.pushState + dispatching popstate so react-router picks it up.
    if(typeof window !== 'undefined' && window.history && typeof window.history.pushState === 'function'){
      try{
        window.history.pushState(null, '', '/login');
        // notify routers listening to popstate
        window.dispatchEvent(new PopStateEvent('popstate'));
        return;
      }catch(e){
        // fallthrough to assign
      }
    }
    if(typeof window !== 'undefined'){
      try{ window.location.assign('/login'); }catch(e){ window.location.href = '/login'; }
    }
  }

  return (
    <AuthContext.Provider value={{token,user,setToken,setUser,logout}}>
      {children}
    </AuthContext.Provider>
  );
}
