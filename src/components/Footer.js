import React from 'react';
import { FaHeart, FaGithub, FaInstagram, FaRocket } from 'react-icons/fa';
import { MdSecurity } from 'react-icons/md';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Instagram Downloader</h4>
            <p>Fast, secure, and free Instagram media downloader. Download photos, videos, reels, and stories in high quality.</p>
            <div className="social-links">
              <a href="https://github.com/AYG45" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <FaGithub />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li><FaRocket /> Fast Downloads</li>
              <li><MdSecurity /> Secure & Private</li>
              <li>📱 Mobile Friendly</li>
              <li>💯 100% Free</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Supported Content</h4>
            <ul>
              <li>📸 Instagram Photos</li>
              <li>🎥 Instagram Videos</li>
              <li>📱 Instagram Reels</li>
              <li>📚 Carousel Posts</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>How to Use</h4>
            <ul>
              <li>1. Copy Instagram URL</li>
              <li>2. Paste it above</li>
              <li>3. Click Download</li>
              <li>4. Enjoy your media!</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-disclaimer">
            <p>
              <strong>Disclaimer:</strong> This tool is for personal use only. 
              Please respect copyright and Instagram's terms of service. 
              Only download content you have permission to use.
            </p>
          </div>
          
          <div className="footer-credits">
            <p>
              Made with <FaHeart className="heart" /> for the community
            </p>
            <p>&copy;Instagram Downloader. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;