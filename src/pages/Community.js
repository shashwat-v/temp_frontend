import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { forumAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const Community = () => {
    const { isDarkMode } = useTheme();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await forumAPI.getCategories();
            setCategories(response.data.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const CategoryCard = ({ category }) => (
        <div
            onClick={() => navigate(`/community/category/${category.id}`)}
            style={{
                background: isDarkMode
                    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 250, 251, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '32px',
                boxShadow: isDarkMode
                    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                    : '0 8px 32px rgba(102, 126, 234, 0.1)',
                border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)'}`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = isDarkMode
                    ? '0 12px 48px rgba(0, 0, 0, 0.4)'
                    : '0 12px 48px rgba(102, 126, 234, 0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = isDarkMode
                    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                    : '0 8px 32px rgba(102, 126, 234, 0.1)';
            }}
        >
            {/* Gradient Background */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '200px',
                height: '200px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                filter: 'blur(60px)',
                opacity: 0.15,
                pointerEvents: 'none'
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            fontSize: '48px',
                            width: '72px',
                            height: '72px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '16px',
                            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
                        }}>
                            {category.icon}
                        </div>
                        <div>
                            <h3 style={{
                                fontSize: '24px',
                                fontWeight: '800',
                                fontFamily: "'Outfit', sans-serif",
                                color: isDarkMode ? '#ffffff' : '#1f2937',
                                margin: '0 0 8px 0',
                                letterSpacing: '-0.02em'
                            }}>
                                {category.name}
                            </h3>
                            <p style={{
                                fontSize: '14px',
                                color: isDarkMode ? '#94a3b8' : '#64748b',
                                margin: 0,
                                lineHeight: '1.5'
                            }}>
                                {category.description}
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    gap: '24px',
                    marginTop: '24px',
                    paddingTop: '24px',
                    borderTop: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)'}`
                }}>
                    <div>
                        <p style={{
                            fontSize: '12px',
                            color: isDarkMode ? '#94a3b8' : '#64748b',
                            margin: '0 0 4px 0',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            fontWeight: '600'
                        }}>
                            Threads
                        </p>
                        <p style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            color: isDarkMode ? '#ffffff' : '#1f2937',
                            margin: 0
                        }}>
                            {category.thread_count || 0}
                        </p>
                    </div>
                    {category.last_activity && (
                        <div>
                            <p style={{
                                fontSize: '12px',
                                color: isDarkMode ? '#94a3b8' : '#64748b',
                                margin: '0 0 4px 0',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                fontWeight: '600'
                            }}>
                                Last Activity
                            </p>
                            <p style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: isDarkMode ? '#cbd5e1' : '#475569',
                                margin: 0
                            }}>
                                {format(new Date(category.last_activity), 'MMM dd, yyyy')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (loading) {
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
                        <p style={{ fontSize: '16px', fontWeight: '600' }}>Loading Community...</p>
                    </div>
                </div>
            </div>
        );
    }

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
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '40px'
                }}>
                    <div>
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
                            Community Forum
                        </h1>
                        <p style={{
                            fontSize: '16px',
                            color: isDarkMode ? '#94a3b8' : '#64748b',
                            margin: 0
                        }}>
                            Engage with your community, share ideas, and collaborate
                        </p>
                    </div>

                    {isAuthenticated && (
                        <button
                            onClick={() => navigate('/community/new-thread')}
                            style={{
                                padding: '14px 28px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '15px',
                                fontWeight: '700',
                                fontFamily: "'Inter', sans-serif",
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.3)';
                            }}
                        >
                            <span style={{ fontSize: '20px' }}>➕</span>
                            New Thread
                        </button>
                    )}
                </div>

                {/* Categories Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
                    gap: '24px'
                }}>
                    {categories.map((category) => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                </div>

                {/* Empty State */}
                {categories.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '80px 20px',
                        color: isDarkMode ? '#94a3b8' : '#64748b'
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>💬</div>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            margin: '0 0 8px 0',
                            color: isDarkMode ? '#ffffff' : '#1f2937'
                        }}>
                            No Categories Yet
                        </h3>
                        <p style={{ fontSize: '14px', margin: 0 }}>
                            Forum categories will appear here
                        </p>
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

export default Community;
