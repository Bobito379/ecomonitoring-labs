import React from 'react';
import './TabButton.css';

function TabButton({ active = false, onClick, children }) {
  return (
    <button 
      className={`tab-btn ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default TabButton;
