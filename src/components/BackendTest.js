import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BackendTest = () => {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [backendData, setBackendData] = useState(null);

  useEffect(() => {
    const testBackend = async () => {
      try {
        const response = await axios.get('/api/test');
        setBackendStatus('connected');
        setBackendData(response.data);
      } catch (error) {
        setBackendStatus('disconnected');
        console.error('Backend test failed:', error);
      }
    };

    testBackend();
  }, []);

  const getStatusColor = () => {
    switch (backendStatus) {
      case 'connected': return '#28a745';
      case 'disconnected': return '#dc3545';
      default: return '#ffc107';
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      padding: '10px', 
      borderRadius: '8px', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      fontSize: '12px',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div 
          style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: getStatusColor() 
          }}
        />
        <span>Backend: {backendStatus}</span>
      </div>
      {backendData && (
        <div style={{ marginTop: '5px', fontSize: '10px', color: '#666' }}>
          {backendData.message}
        </div>
      )}
    </div>
  );
};

export default BackendTest;