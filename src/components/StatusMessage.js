import React, { useEffect } from 'react';

const StatusMessage = ({ message, type = 'info', onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getColors = () => {
    switch (type) {
      case 'success':
        return { bg: '#dcfce7', border: '#16a34a', text: '#166534' };
      case 'error':
        return { bg: '#fee2e2', border: '#dc2626', text: '#dc2626' };
      case 'warning':
        return { bg: '#fef3c7', border: '#d97706', text: '#92400e' };
      default:
        return { bg: '#dbeafe', border: '#2563eb', text: '#1e40af' };
    }
  };

  const colors = getColors();

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 10000,
      backgroundColor: colors.bg,
      border: `2px solid ${colors.border}`,
      color: colors.text,
      padding: '12px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      maxWidth: '400px',
      fontWeight: '500'
    }}>
      <span style={{ fontSize: '16px' }}>
        {type === 'success' && '✅'}
        {type === 'error' && '❌'}
        {type === 'warning' && '⚠️'}
        {type === 'info' && 'ℹ️'}
      </span>
      <span style={{ fontSize: '14px' }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: colors.text,
            cursor: 'pointer',
            fontSize: '16px',
            padding: '0',
            marginLeft: '10px'
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default StatusMessage;