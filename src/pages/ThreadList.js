import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { forumAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const ThreadList = () => {
    const { isDarkMode } = useTheme();
    const { isAuthenticated } = useAuth();
    const { categoryId } = useParams();
    const navigate = useNavigate();

    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 20;

    useEffect(() => {
        fetchThreads();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryId, page]);

    const fetchThreads = async () => {
        try {
            setLoading(true);
            const response = await forumAPI.getThreadsByCategory(categoryId, { page, limit });
            setThreads(response.data.data.threads);
            setTotal(response.data.data.total);
        } catch (error) {
            console.error('Error fetching threads:', error);
        } finally {
            setLoading(false);
        }
    };

    const ThreadCard = ({ thread }) => (
        <div
            onClick={() => navigate(`/community/thread/${thread.id}`)}
            style={{
                background: isDarkMode
                    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.4) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.8) 100%)',
                borderRadius: '12px',
                padding: '24px',
                border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.15)' : 'rgba(102, 126, 234, 0.1)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = isDarkMode
                    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.6) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(249, 250, 251, 1) 100%)';
                e.currentTarget.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = isDarkMode
                    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.4) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.8) 100%)';
                e.currentTarget.style.transform = 'translateX(0)';
            }}
        >
            {/* Pinned Badge */}
            {thread.is_pinned && (
                <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '4px 12px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: 'white',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    📌 Pinned
                </div>
            )}

            <div style={{ display: 'flex', gap: '20px' }}>
                {/* Thread Info */}
                <div style={{ flex: 1 }}>
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: isDarkMode ? '#ffffff' : '#1f2937',
                        margin: '0 0 12px 0',
                        lineHeight: '1.4',
                        paddingRight: thread.is_pinned ? '100px' : '0'
                    }}>
                        {thread.title}
                    </h3>

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
                        {thread.content}
                    </p>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        flexWrap: 'wrap'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '13px',
                            color: isDarkMode ? '#94a3b8' : '#64748b'
                        }}>
                            <span style={{ fontSize: '16px' }}>👤</span>
                            <span style={{ fontWeight: '600' }}>
                                {thread.author_name || 'Anonymous'}
                            </span>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '13px',
                            color: isDarkMode ? '#94a3b8' : '#64748b'
                        }}>
                            <span style={{ fontSize: '16px' }}>💬</span>
                            <span>{thread.reply_count || 0} replies</span>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '13px',
                            color: isDarkMode ? '#94a3b8' : '#64748b'
                        }}>
                            <span style={{ fontSize: '16px' }}>👁️</span>
                            <span>{thread.view_count || 0} views</span>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '13px',
                            color: isDarkMode ? '#94a3b8' : '#64748b'
                        }}>
                            <span style={{ fontSize: '16px' }}>🕒</span>
                            <span>{format(new Date(thread.created_at), 'MMM dd, yyyy')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Last Post Info */}
            {thread.last_post_author_name && (
                <div style={{
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)'}`,
                    fontSize: '12px',
                    color: isDarkMode ? '#94a3b8' : '#64748b'
                }}>
                    Last reply by <strong style={{ color: isDarkMode ? '#cbd5e1' : '#475569' }}>
                        {thread.last_post_author_name}
                    </strong> • {format(new Date(thread.last_post_at), 'MMM dd, h:mm a')}
                </div>
            )}
        </div>
    );

    if (loading && page === 1) {
        return (
            <div style={{ minHeight: '100vh', background: isDarkMode ? '#0f172a' : '#f9fafb' }}>
                <Navbar />
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 'calc(100vh - 72px)',
                    color: isDarkMode ? '#cbd5e1' : '#6b7280'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            border: '4px solid rgba(102, 126, 234, 0.2)',
                            borderTopColor: '#667eea',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 16px'
                        }} />
                        <p style={{ fontSize: '16px', fontWeight: '600' }}>Loading Threads...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: isDarkMode ? '#0f172a' : '#f9fafb',
            transition: 'background 0.3s ease',
            overflowY: 'auto',
            overflowX: 'hidden'
        }}>
            <Navbar />

            <div style={{
                maxWidth: '1000px',
                margin: '0 auto',
                padding: '40px 24px'
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '32px'
                }}>
                    <div>
                        <button
                            onClick={() => navigate('/community')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: isDarkMode ? '#94a3b8' : '#64748b',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '12px',
                                padding: '8px 0',
                                transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#667eea'}
                            onMouseLeave={(e) => e.target.style.color = isDarkMode ? '#94a3b8' : '#64748b'}
                        >
                            ← Back to Categories
                        </button>
                        <h1 style={{
                            fontSize: '36px',
                            fontWeight: '900',
                            fontFamily: "'Outfit', sans-serif",
                            color: isDarkMode ? '#ffffff' : '#1f2937',
                            margin: '0 0 8px 0',
                            letterSpacing: '-0.02em'
                        }}>
                            Discussion Threads
                        </h1>
                        <p style={{
                            fontSize: '14px',
                            color: isDarkMode ? '#94a3b8' : '#64748b',
                            margin: 0
                        }}>
                            {total} thread{total !== 1 ? 's' : ''} in this category
                        </p>
                    </div>

                    {isAuthenticated && (
                        <button
                            onClick={() => navigate('/community/new-thread', { state: { categoryId } })}
                            style={{
                                padding: '12px 24px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '14px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                            }}
                        >
                            ➕ New Thread
                        </button>
                    )}
                </div>

                {/* Threads List */}
                {threads.length > 0 ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        {threads.map((thread) => (
                            <ThreadCard key={thread.id} thread={thread} />
                        ))}
                    </div>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 20px',
                        background: isDarkMode
                            ? 'rgba(30, 41, 59, 0.3)'
                            : 'rgba(255, 255, 255, 0.5)',
                        borderRadius: '16px',
                        border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)'}`
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>💬</div>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            margin: '0 0 8px 0',
                            color: isDarkMode ? '#ffffff' : '#1f2937'
                        }}>
                            No Threads Yet
                        </h3>
                        <p style={{
                            fontSize: '14px',
                            color: isDarkMode ? '#94a3b8' : '#64748b',
                            margin: '0 0 24px 0'
                        }}>
                            Be the first to start a discussion in this category!
                        </p>
                        {isAuthenticated && (
                            <button
                                onClick={() => navigate('/community/new-thread', { state: { categoryId } })}
                                style={{
                                    padding: '12px 24px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Create First Thread
                            </button>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {total > limit && (
                    <div style={{
                        marginTop: '40px',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '12px'
                    }}>
                        <button
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                            style={{
                                padding: '10px 20px',
                                background: page === 1
                                    ? (isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(229, 231, 235, 0.5)')
                                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: page === 1 ? (isDarkMode ? '#64748b' : '#9ca3af') : 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: page === 1 ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            ← Previous
                        </button>
                        <span style={{
                            padding: '10px 20px',
                            color: isDarkMode ? '#cbd5e1' : '#475569',
                            fontSize: '14px',
                            fontWeight: '600'
                        }}>
                            Page {page} of {Math.ceil(total / limit)}
                        </span>
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page >= Math.ceil(total / limit)}
                            style={{
                                padding: '10px 20px',
                                background: page >= Math.ceil(total / limit)
                                    ? (isDarkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(229, 231, 235, 0.5)')
                                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: page >= Math.ceil(total / limit) ? (isDarkMode ? '#64748b' : '#9ca3af') : 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: page >= Math.ceil(total / limit) ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default ThreadList;
