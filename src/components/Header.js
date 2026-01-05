import React from 'react';
import { FaInstagram } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <FaInstagram className="logo-icon" />
            <h1 className="logo-text">
              Insta<span className="highlight">Grab</span>
            </h1>
          </div>
        </div>
        
        <div className="header-description">
          <p>Download Instagram photos, videos & reels in HD quality</p>
          <div className="features">
            <span className="feature">📸 Photos</span>
            <span className="feature">🎬 Reels</span>
            <span className="feature">🎥 Videos</span>
            <span className="feature">📚 Carousels</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
