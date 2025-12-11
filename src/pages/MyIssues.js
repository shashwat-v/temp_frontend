import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { issuesAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const MyIssues = () => {
    const { isDarkMode } = useTheme();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, open, in_progress, resolved, closed
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchMyIssues();
    }, [isAuthenticated, navigate]);

    const fetchMyIssues = async () => {
        try {
            setLoading(true);
            const response = await issuesAPI.getMyIssues();
            setIssues(response.data.issues || []);
        } catch (err) {
            setError('Failed to load your issues');
        } finally {
            setLoading(false);
        }
    };

    const filteredIssues = filter === 'all'
        ? issues
        : issues.filter(issue => issue.status === filter);

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: '#ef4444' };
            case 'in_progress': return { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: '#3b82f6' };
            case 'resolved': return { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: '#10b981' };
            case 'closed': return { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280', border: '#6b7280' };
            default: return { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280', border: '#6b7280' };
        }
    };

    const getCategoryIcon = (category) => {
        const icons = {
            pothole: '🕳️',
            garbage: '🗑️',
            streetlight: '💡',
            water: '💧',
            traffic: '🚦',
            other: '📌'
        };
        return icons[category] || '📌';
    };

    const filters = [
        { value: 'all', label: 'All Issues', icon: '📊' },
        { value: 'open', label: 'Open', icon: '🔴' },
        { value: 'in_progress', label: 'In Progress', icon: '🔵' },
        { value: 'resolved', label: 'Resolved', icon: '✅' },
        { value: 'closed', label: 'Closed', icon: '⚫' }
    ];

    return (
        <div style={{
            width: '100%',
            minHeight: '100vh',
            background: isDarkMode ? '#0f172a' : '#f9fafb',
            transition: 'background 0.3s ease',
            position: 'relative'
        }}>
            <Navbar />

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '40px 24px'
            }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{
                        fontSize: '42px',
                        fontWeight: '900',
                        fontFamily: "'Outfit', sans-serif",
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        margin: '0 0 8px 0',
                        letterSpacing: '-0.03em'
                    }}>
                        📋 My Issues
                    </h1>
                    <p style={{
                        fontSize: '16px',
                        color: isDarkMode ? '#94a3b8' : '#64748b',
                        margin: 0
                    }}>
                        Track and manage all issues you've reported
                    </p>
                </div>

                {/* Filters */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '32px',
                    flexWrap: 'wrap'
                }}>
                    {filters.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            style={{
                                padding: '12px 20px',
                                background: filter === f.value
                                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                    : (isDarkMode ? 'rgba(30, 41, 59, 0.8)' : 'white'),
                                color: filter === f.value ? 'white' : (isDarkMode ? '#cbd5e1' : '#475569'),
                                border: filter === f.value
                                    ? 'none'
                                    : `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.15)'}`,
                                borderRadius: '12px',
                                fontSize: '14px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                boxShadow: filter === f.value
                                    ? '0 4px 12px rgba(102, 126, 234, 0.3)'
                                    : 'none'
                            }}
                            onMouseEnter={(e) => {
                                if (filter !== f.value) {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = isDarkMode
                                        ? '0 4px 12px rgba(102, 126, 234, 0.2)'
                                        : '0 4px 12px rgba(102, 126, 234, 0.15)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                if (filter !== f.value) {
                                    e.target.style.boxShadow = 'none';
                                }
                            }}
                        >
                            <span>{f.icon}</span>
                            <span>{f.label}</span>
                            {filter === f.value && (
                                <span style={{
                                    background: 'rgba(255, 255, 255, 0.3)',
                                    padding: '2px 8px',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: '800'
                                }}>
                                    {filteredIssues.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading && (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        color: isDarkMode ? '#cbd5e1' : '#64748b'
                    }}>
                        <div style={{
                            fontSize: '48px',
                            marginBottom: '16px',
                            animation: 'pulse 2s ease-in-out infinite'
                        }}>
                            ⏳
                        </div>
                        <p style={{ fontSize: '18px', fontWeight: '600' }}>Loading your issues...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '2px solid #ef4444',
                        borderRadius: '16px',
                        padding: '24px',
                        textAlign: 'center',
                        color: '#ef4444'
                    }}>
                        <p style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
                            ❌ {error}
                        </p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredIssues.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px'
                    }}>
                        <div style={{
                            fontSize: '64px',
                            marginBottom: '16px'
                        }}>
                            {filter === 'all' ? '📭' : '🔍'}
                        </div>
                        <h3 style={{
                            fontSize: '24px',
                            fontWeight: '800',
                            color: isDarkMode ? '#ffffff' : '#1f2937',
                            marginBottom: '8px'
                        }}>
                            {filter === 'all' ? 'No issues yet' : `No ${filter.replace('_', ' ')} issues`}
                        </h3>
                        <p style={{
                            fontSize: '16px',
                            color: isDarkMode ? '#94a3b8' : '#64748b',
                            marginBottom: '24px'
                        }}>
                            {filter === 'all'
                                ? 'Start by reporting an issue on the map'
                                : `You don't have any ${filter.replace('_', ' ')} issues`
                            }
                        </p>
                        {filter === 'all' && (
                            <button
                                onClick={() => navigate('/')}
                                style={{
                                    padding: '14px 28px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                🗺️ Go to Map
                            </button>
                        )}
                    </div>
                )}

                {/* Issues Grid */}
                {!loading && !error && filteredIssues.length > 0 && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                        gap: '24px'
                    }}>
                        {filteredIssues.map((issue) => {
                            const statusStyle = getStatusColor(issue.status);

                            return (
                                <div
                                    key={issue.id}
                                    style={{
                                        background: isDarkMode
                                            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%)'
                                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 250, 251, 0.95) 100%)',
                                        backdropFilter: 'blur(20px)',
                                        borderRadius: '16px',
                                        padding: '24px',
                                        boxShadow: isDarkMode
                                            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                                            : '0 8px 32px rgba(102, 126, 234, 0.1)',
                                        border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)'}`,
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                    onClick={() => navigate(`/`)} // Navigate to map and highlight this issue
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = isDarkMode
                                            ? '0 12px 48px rgba(102, 126, 234, 0.3)'
                                            : '0 12px 48px rgba(102, 126, 234, 0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = isDarkMode
                                            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                                            : '0 8px 32px rgba(102, 126, 234, 0.1)';
                                    }}
                                >
                                    {/* Category Icon */}
                                    <div style={{
                                        fontSize: '32px',
                                        marginBottom: '12px'
                                    }}>
                                        {getCategoryIcon(issue.category)}
                                    </div>

                                    {/* Title */}
                                    <h3 style={{
                                        fontSize: '18px',
                                        fontWeight: '800',
                                        color: isDarkMode ? '#ffffff' : '#1f2937',
                                        margin: '0 0 8px 0',
                                        fontFamily: "'Outfit', sans-serif",
                                        lineHeight: '1.3'
                                    }}>
                                        {issue.title}
                                    </h3>

                                    {/* Description */}
                                    <p style={{
                                        fontSize: '14px',
                                        color: isDarkMode ? '#94a3b8' : '#64748b',
                                        margin: '0 0 16px 0',
                                        lineHeight: '1.6',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {issue.description}
                                    </p>

                                    {/* Status Badge */}
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '6px 12px',
                                        background: statusStyle.bg,
                                        border: `1px solid ${statusStyle.border}`,
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        color: statusStyle.text,
                                        textTransform: 'capitalize',
                                        marginBottom: '16px'
                                    }}>
                                        {issue.status.replace('_', ' ')}
                                    </div>

                                    {/* Meta Info */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingTop: '16px',
                                        borderTop: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.08)'}`
                                    }}>
                                        <div style={{
                                            fontSize: '12px',
                                            color: isDarkMode ? '#64748b' : '#94a3b8',
                                            fontWeight: '600'
                                        }}>
                                            📅 {format(new Date(issue.created_at), 'MMM dd, yyyy')}
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: isDarkMode ? '#64748b' : '#94a3b8',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            ⬆️ {issue.upvote_count || 0}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Animation */}
            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
        </div>
    );
};

export default MyIssues;
