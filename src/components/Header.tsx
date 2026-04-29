import React, { useState } from 'react';
import './Header.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <a href="/">
            <div className="logo-text"><span className="logo-prefix">~/</span>echowaves</div>
          </a>
        </div>
        <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
          <a href="/#about">About</a>
          <a href="/#projects">Projects</a>
          <a href="/#packages">Packages</a>
          <a href="/#blog">Blog</a>
          <a href="https://github.com/echowaves" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </nav>
        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>
    </header>
  );
};

export default Header;
