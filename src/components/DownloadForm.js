import React, { useState } from 'react';
import { FaDownload, FaSpinner, FaLink, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
import './DownloadForm.css';

const DownloadForm = ({ onDownloadStart, onDownloadComplete, onDownloadError, isLoading }) => {
  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);

  const validateInstagramUrl = (inputUrl) => {
    const instagramRegex = /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[A-Za-z0-9_-]+\/?/;
    return instagramRegex.test(inputUrl);
  };

  const handleUrlChange = (e) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);
    setIsValidUrl(validateInstagramUrl(inputUrl));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('Please enter an Instagram URL');
      return;
    }

    if (!isValidUrl) {
      toast.error('Please enter a valid Instagram URL');
      return;
    }

    onDownloadStart();
    
    try {
      toast.info('Starting download...');
      
      // Real API call to backend
      const response = await axios.post('/api/download', { url });
      
      if (response.data.success) {
        onDownloadComplete(response.data.mediaFiles);
        toast.success(`Successfully downloaded ${response.data.mediaFiles.length} files!`);
        setUrl('');
        setIsValidUrl(false);
      } else {
        throw new Error(response.data.error || 'Download failed');
      }
      
    } catch (error) {
      console.error('Download error:', error);
      onDownloadError();
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Failed to download media. Please try again.');
      }
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setIsValidUrl(validateInstagramUrl(text));
      toast.success('URL pasted from clipboard!');
    } catch (error) {
      toast.error('Failed to paste from clipboard');
    }
  };

  return (
    <div className="download-form-container fade-in">
      <div className="download-form-card">
        <div className="form-header">
          <h2>Download Instagram Media</h2>
          <p>Paste your Instagram link below to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="download-form">
          <div className="input-group">
            <div className="input-wrapper">
              <FaLink className="input-icon" />
              <input
                type="url"
                value={url}
                onChange={handleUrlChange}
                placeholder="https://instagram.com/p/..."
                className={`url-input ${isValidUrl ? 'valid' : ''} ${url && !isValidUrl ? 'invalid' : ''}`}
                disabled={isLoading}
              />
              {isValidUrl && <FaCheckCircle className="valid-icon" />}
            </div>
            
            <button
              type="button"
              onClick={handlePaste}
              className="paste-btn"
              disabled={isLoading}
              title="Paste from clipboard"
            >
              📋
            </button>
          </div>

          <div className="url-examples">
            <p>Supported formats:</p>
            <div className="examples">
              <span>instagram.com/p/[post-id]</span>
              <span>instagram.com/reel/[reel-id]</span>
              <span>instagram.com/tv/[tv-id]</span>
            </div>
          </div>

          <button
            type="submit"
            className={`download-btn ${isLoading ? 'loading' : ''}`}
            disabled={!isValidUrl || isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className="spin" />
                Downloading...
              </>
            ) : (
              <>
                <FaDownload />
                Download Media
              </>
            )}
          </button>
        </form>

        <div className="features-info">
          <div className="feature-item">
            <span className="feature-icon">🚀</span>
            <span>Fast Downloads</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <span>Secure & Private</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📱</span>
            <span>Mobile Friendly</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">💯</span>
            <span>100% Free</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadForm;