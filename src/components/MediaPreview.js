import React from 'react';
import { FaDownload, FaImage, FaVideo, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './MediaPreview.css';

const MediaPreview = ({ mediaFiles, isLoading }) => {
  const handleDownload = async (file) => {
    try {
      // Debug: log the file object
      console.log('File object:', file);
      
      // Check if we have the required data
      if (!file.postUrl || file.index === undefined) {
        console.error('Missing postUrl or index:', file);
        alert(`Failed to download ${file.filename}. Missing required data. Please try fetching the media again.`);
        return;
      }

      // Use proxy with fresh URL fetching to avoid expired URLs
      const params = new URLSearchParams({
        postUrl: encodeURIComponent(file.postUrl),
        filename: encodeURIComponent(file.filename),
        index: file.index.toString()
      });
      
      const proxyUrl = `/api/proxy-download?${params.toString()}`;
      
      console.log(`Downloading ${file.filename} via proxy...`);
      console.log(`Proxy URL: ${proxyUrl}`);
      
      // Try to fetch first to check for errors
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Download failed:', errorData);
        alert(`Failed to download: ${errorData.error || 'Unknown error'}`);
        return;
      }
      
      // If successful, trigger download
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = file.filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
      
      console.log(`✅ Successfully downloaded: ${file.filename}`);
      
    } catch (error) {
      console.error('Download failed:', error);
      alert(`Failed to download ${file.filename}. Error: ${error.message}`);
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
                      <div className="fallback-preview">
                        <FaImage />
                        <span>Image Ready</span>
                        <small>Click download button</small>
                      </div>
                    </div>
                  ) : (
                    <div className="video-preview">
                      <div className="fallback-preview">
                        <FaVideo />
                        <span>Video Ready</span>
                        <small>Click download button</small>
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