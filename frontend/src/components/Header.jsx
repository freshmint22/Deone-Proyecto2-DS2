import React from 'react';

export default function Header(){
  return (
    <>
      <div className="topbar topbar-compact">
        <div className="container">
          <div className="logo logo-compact">DeOne</div>
          <div style={{flex:1}} />
        </div>
      </div>
      {/* simple spacer so content isn't hidden under fixed bottom nav */}
      <div style={{height:8}} />
    </>
  );
}
