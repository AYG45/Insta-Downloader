import React from 'react';
import { FaDownload, FaImage, FaVideo, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './MediaPreview.css';

const MediaPreview = ({ mediaFiles, isLoading }) => {
  const handleDownload = async (file) => {
    try {
      // Use fetch to get the file as a blob
      const response = await fetch(file.downloadUrl || file.url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      // Create a blob URL and trigger download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback to direct link
      const link = document.createElement('a');
      link.href = file.downloadUrl || file.url;
      link.download = file.filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadAll = () => {
    mediaFiles.forEach((file, index) => {
      setTimeout(() => {
        handleDownload(file);
      }, index * 500); // Stagger downloads by 500ms
    });
  };

  if (isLoading) {
    return (
      <motion.div 
        className="media-preview-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="loading-card">
          <div className="loading-content">
            <FaSpinner className="loading-spinner spin" />
            <h3>Processing your request...</h3>
            <p>Fetching media from Instagram</p>
            <div className="loading-steps">
              <div className="step active">
                <span className="step-number">1</span>
                <span>Analyzing URL</span>
              </div>
              <div className="step active">
                <span className="step-number">2</span>
                <span>Fetching media</span>
              </div>
              <div className="step">
                <span className="step-number">3</span>
                <span>Preparing download</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (mediaFiles.length === 0) {
    return null;
  }

  return (
    <motion.div 
      className="media-preview-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="media-preview-card">
        <div className="preview-header">
          <h3>Downloaded Media ({mediaFiles.length} files)</h3>
          {mediaFiles.length > 1 && (
            <button onClick={downloadAll} className="download-all-btn">
              <FaDownload />
              Download All
            </button>
          )}
        </div>

        <div className="media-grid">
          <AnimatePresence>
            {mediaFiles.map((file, index) => (
              <motion.div
                key={file.id}
                className="media-item"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="media-preview">
                  {file.type === 'image' ? (
                    <div className="image-preview">
                      <img 
                        src={file.downloadUrl || file.originalUrl} 
                        alt={file.filename}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="fallback-preview" style={{ display: 'none' }}>
                        <FaImage />
                        <span>Image Preview</span>
                        <small>Click download to view</small>
                      </div>
                    </div>
                  ) : (
                    <div className="video-preview">
                      <video 
                        src={file.downloadUrl || file.originalUrl}
                        muted
                        loop
                        onMouseEnter={(e) => e.target.play()}
                        onMouseLeave={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="fallback-preview" style={{ display: 'none' }}>
                        <FaVideo />
                        <span>Video Preview</span>
                        <small>Click download to view</small>
                      </div>
                    </div>
                  )}
                  
                  <div className="media-overlay">
                    <button 
                      onClick={() => handleDownload(file)}
                      className="download-item-btn"
                      title={`Download this ${file.type}`}
                    >
                      <FaDownload />
                    </button>
                  </div>
                </div>

                <div className="media-info">
                  <div className="media-details">
                    <span className="media-type">
                      {file.type === 'image' ? <FaImage /> : <FaVideo />}
                      {file.type}
                    </span>
                    <span className="media-size">{file.size}</span>
                  </div>
                  <p className="media-filename">{file.filename}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="preview-footer">
          <div className="download-info">
            <p>💡 Click on individual items to download, or use "Download All" for bulk download</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MediaPreview;