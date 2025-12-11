import React, { useState } from 'react';

const LocationPrompt = ({ 
  location, 
  loading, 
  error, 
  permissionStatus, 
  onRequestLocation, 
  onDismiss 
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || permissionStatus === 'granted') {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) onDismiss();
  };

  const handleRequestLocation = () => {
    onRequestLocation();
  };

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      backgroundColor: 'white',
      padding: '16px 20px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      border: '1px solid #e5e7eb',
      maxWidth: '400px',
      minWidth: '300px',
      textAlign: 'center'
    }}>
      {loading && (
        <div style={{ color: '#3b82f6' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '8px'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid #e5e7eb',
              borderTop: '2px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <span style={{ fontSize: '16px' }}>📍</span>
          </div>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>
            Getting your location...
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
            This helps show nearby issues
          </p>
        </div>
      )}
      
      {error && (
        <div style={{ color: '#ef4444' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '12px'
          }}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
          </div>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '500' }}>
            Location Access Needed
          </p>
          <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#6b7280' }}>
            {error}
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button
              onClick={handleRequestLocation}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Try Again
            </button>
            <button
              onClick={handleDismiss}
              style={{
                padding: '6px 12px',
                fontSize: '12px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Skip
            </button>
          </div>
        </div>
      )}
      
      {permissionStatus === 'unknown' && !loading && !error && (
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '12px'
          }}>
            <span style={{ fontSize: '20px' }}>📍</span>
          </div>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
            Find Issues Near You
          </p>
          <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#6b7280' }}>
            Allow location access to see civic issues in your area and report new ones more easily.
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button
              onClick={handleRequestLocation}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Allow Location
            </button>
            <button
              onClick={handleDismiss}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                backgroundColor: '#e5e7eb',
                color: '#374151',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LocationPrompt;