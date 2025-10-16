import React from 'react';
import NotificationBell from './NotificationBell';

export default function Header(){
  return (
    <header style={{padding:16,background:'#fff',borderBottom:'1px solid #eee',display:'flex',alignItems:'center'}}>
      <h2 style={{margin:0}}>Deone</h2>
      <div style={{marginLeft:'auto'}}>
        <NotificationBell />
      </div>
    </header>
  );
}
