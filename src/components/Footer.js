import React from 'react';
import { FaHeart, FaGithub, FaInstagram } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>InstaGrab</h4>
          <p>Fast, secure, and free Instagram media downloader. No login required.</p>
          <div className="social-links">
            <a href="https://github.com/AYG45" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub />
            </a>
            <a href="https://www.instagram.com/__aditya._.45/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Supported</h4>
          <ul>
            <li>📸 Photos</li>
            <li>🎬 Reels</li>
            <li>🎥 Videos</li>
            <li>📚 Carousels</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Features</h4>
          <ul>
            <li>⚡ Fast Downloads</li>
            <li>🔒 No Login Required</li>
            <li>📱 Mobile Friendly</li>
            <li>💯 100% Free</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>How to Use</h4>
          <ul>
            <li>1. Copy Instagram URL</li>
            <li>2. Paste it above</li>
            <li>3. Click Download</li>
            <li>4. Save your media!</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-disclaimer">
          <p>
            <strong>Disclaimer:</strong> This tool is for personal use only. 
            Please respect copyright and Instagram's terms of service.
          </p>
        </div>
        
        <div className="footer-credits">
          <p>Made with <FaHeart className="heart" /> for the community</p>
          <p>© 2025 InstaGrab</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
