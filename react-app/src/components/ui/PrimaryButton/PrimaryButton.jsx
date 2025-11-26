import React from 'react';
import './PrimaryButton.css';

function PrimaryButton({ children, onClick, disabled = false }) {
  return (
    <button 
      className="btn-primary" 
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default PrimaryButton;
