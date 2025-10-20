import React from 'react';
import NotificationBell from './NotificationBell';

export default function Header(){
  return (
    <>
      <div className="topbar">
        <div className="logo">Deone</div>
        <div style={{flex:1}} />
        <NotificationBell />
      </div>
      {/* simple spacer so content isn't hidden under fixed bottom nav */}
      <div style={{height:8}} />
    </>
  );
}
