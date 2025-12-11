import React from 'react';

const IssueListItem = ({ issue, onClick, isSelected }) => {
  const getStatusColor = (status) => {
    const colors = {
      open: '#ef4444',
      in_progress: '#3b82f6',
      resolved: '#10b981',
      closed: '#6b7280',
    };
    return colors[status] || colors.open;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      pothole: '🕳️',
      garbage: '🗑️',
      streetlight: '💡',
      water: '💧',
      traffic: '🚦',
      other: '📍'
    };
    return icons[category] || '📍';
  };

  return (
    <div
      onClick={() => onClick(issue)}
      style={{
        padding: '12px',
        borderRadius: '8px',
        border: isSelected ? '2px solid #2563eb' : '1px solid #e5e7eb',
        backgroundColor: isSelected ? '#eff6ff' : 'white',
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginBottom: '8px'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = '#f9fafb';
          e.currentTarget.style.borderColor = '#d1d5db';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = 'white';
          e.currentTarget.style.borderColor = '#e5e7eb';
        }
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '14px' }}>{getCategoryIcon(issue.category)}</span>
          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            color: getStatusColor(issue.status),
            textTransform: 'uppercase'
          }}>
            {issue.status.replace('_', ' ')}
          </span>
        </div>
        <span style={{ fontSize: '11px', color: '#6b7280' }}>
          👍 {issue.upvote_count || 0}
        </span>
      </div>
      
      <h4 style={{
        margin: '0 0 6px 0',
        fontSize: '13px',
        fontWeight: '600',
        color: '#1f2937',
        lineHeight: '1.3',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
      }}>
        {issue.title}
      </h4>
      
      <p style={{
        margin: '0 0 8px 0',
        fontSize: '11px',
        color: '#6b7280',
        lineHeight: '1.3',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
      }}>
        {issue.description}
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ 
          fontSize: '10px', 
          color: '#9ca3af',
          textTransform: 'capitalize'
        }}>
          {issue.category}
        </span>
        <span style={{ fontSize: '10px', color: '#9ca3af' }}>
          {new Date(issue.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default IssueListItem;