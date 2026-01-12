import { useEffect } from 'react';

function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getStyles = () => {
    const baseStyles = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '1rem 1.5rem',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      zIndex: 9999,
      animation: 'slideIn 0.3s ease-out',
      minWidth: '300px',
      maxWidth: '500px'
    };

    const typeStyles = {
      success: {
        backgroundColor: '#d1fae5',
        color: '#065f46',
        border: '1px solid #10b981'
      },
      error: {
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        border: '1px solid #ef4444'
      },
      info: {
        backgroundColor: '#dbeafe',
        color: '#1e40af',
        border: '1px solid #3b82f6'
      },
      warning: {
        backgroundColor: '#fef3c7',
        color: '#92400e',
        border: '1px solid #f59e0b'
      }
    };

    return { ...baseStyles, ...typeStyles[type] };
  };

  const getIcon = () => {
    const icons = {
      success: '✅',
      error: '❌',
      info: 'ℹ️',
      warning: '⚠️'
    };
    return icons[type] || '✅';
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      
      <div style={getStyles()}>
        <span style={{ fontSize: '1.25rem' }}>{getIcon()}</span>
        <span style={{ flex: 1 }}>{message}</span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.25rem',
            cursor: 'pointer',
            padding: '0',
            color: 'inherit',
            opacity: 0.7
          }}
          onMouseEnter={(e) => e.target.style.opacity = '1'}
          onMouseLeave={(e) => e.target.style.opacity = '0.7'}
        >
          ×
        </button>
      </div>
    </>
  );
}

export default Toast;