import React from 'react';
import './Header.css';

function Header({ title, children }) {
  return (
    <header className="header">
      <h1>{title}</h1>
      <nav className="tabs">
        {children}
      </nav>
    </header>
  );
}

export default Header;
