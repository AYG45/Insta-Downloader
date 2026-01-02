import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import DownloadForm from './components/DownloadForm';
import MediaPreview from './components/MediaPreview';
import Footer from './components/Footer';
import BackendTest from './components/BackendTest';
import './App.css';

function App() {
  const [downloadedMedia, setDownloadedMedia] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadComplete = (mediaFiles) => {
    setDownloadedMedia(mediaFiles);
    setIsLoading(false);
  };

  const handleDownloadStart = () => {
    setIsLoading(true);
    setDownloadedMedia([]);
  };

  const handleDownloadError = () => {
    setIsLoading(false);
  };

  return (
    <div className="App">
      <BackendTest />
      <Header />
      
      <main className="main-content">
        <div className="container">
          <DownloadForm 
            onDownloadStart={handleDownloadStart}
            onDownloadComplete={handleDownloadComplete}
            onDownloadError={handleDownloadError}
            isLoading={isLoading}
          />
          
          {(downloadedMedia.length > 0 || isLoading) && (
            <MediaPreview 
              mediaFiles={downloadedMedia}
              isLoading={isLoading}
            />
          )}
        </div>
      </main>

      <Footer />
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        enableMultiContainer={false}
        containerId="main-toast-container"
      />
    </div>
  );
}

export default App;