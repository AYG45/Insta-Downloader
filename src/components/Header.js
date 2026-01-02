import React from 'react';
import { FaInstagram, FaDownload } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <FaInstagram className="logo-icon" />
            <h1 className="logo-text">
              Instagram <span className="highlight">Downloader</span>
            </h1>
          </div>
          
          <div className="header-info">
            <div className="info-item">
              <FaDownload className="info-icon" />
              <span>Free & Fast Downloads</span>
            </div>
          </div>
        </div>
        
        <div className="header-description">
          <p>Download Instagram photos, videos, reels, and stories in high quality</p>
          <div className="features">
            <span className="feature">📸 Photos</span>
            <span className="feature">🎥 Videos</span>
            <span className="feature">📱 Reels</span>
            <span className="feature">📚 Carousels</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;