import React from 'react';
import NotificationBell from './NotificationBell';

export default function Header(){
  return (
    <>
      <div className="topbar">
        <div className="logo">Deone</div>
        <div className="search">
          <input placeholder="Buscar productos" aria-label="search" />
        </div>
        <NotificationBell />
      </div>
      {/* simple spacer so content isn't hidden under fixed bottom nav */}
      <div style={{height:8}} />
    </>
  );
}
