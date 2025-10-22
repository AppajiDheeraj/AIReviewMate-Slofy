"use client";

import React from 'react';

const Navbar = () => {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      padding: '2em',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 100,
      color: 'white',
      mixBlendMode: 'difference',
      pointerEvents: 'none', // Allow clicks to pass through
    }}>
      <div className="logo" style={{ pointerEvents: 'auto' }}>
        <p style={{ fontWeight: 700, fontSize: '1rem', margin: 0, backgroundColor: "black" }}>AI ✦ Slofy</p>
      </div>
      <div className="register-button" style={{ pointerEvents: 'auto' }}>
        <button style={{
            fontWeight: 700, fontSize: '1rem',
          borderRadius: '999px',
          padding: '0.5em 1.5em',
          border: '1px solid white',
          background: 'transparent',
          color: 'white',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}>
          REGISTER NOW
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
