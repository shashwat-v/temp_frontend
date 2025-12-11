import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

const AIInsights = () => {
    const { isDarkMode } = useTheme();

    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        fetchInsights();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchInsights = async () => {
        try {
            setLoading(true);
            const response = await analyticsAPI.getInsights();
            setInsights(response.data.data.insights);
        } catch (error) {
            console.error('Error fetching insights:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { id: 'all', label: 'All Insights', icon: '🔮', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { id: 'warning', label: 'Warnings', icon: '⏰', color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
        { id: 'alert', label: 'Alerts', icon: '🚨', color: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' },
        { id: 'info', label: 'Information', icon: '💡', color: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' },
        { id: 'success', label: 'Success', icon: '✅', color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
    ];

    const filteredInsights = selectedCategory === 'all'
        ? insights
        : insights.filter(i => i.type === selectedCategory);

    const InsightCard = ({ insight }) => {
        const gradients = {
            warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            alert: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        };

        const icons = {
            warning: '⏰',
            alert: '🚨',
            info: '💡',
            success: '✅'
        };

        return (
            <div style={{
                background: isDarkMode
                    ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 250, 251, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: isDarkMode
                    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                    : '0 8px 32px rgba(102, 126, 234, 0.1)',
                border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)'}`,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
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
                {/* Gradient Orb */}
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-20%',
                    width: '200px',
                    height: '200px',
                    background: gradients[insight.type],
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    opacity: 0.2,
                    pointerEvents: 'none'
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                        {/* Icon */}
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '16px',
                            background: gradients[insight.type],
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '32px',
                            flexShrink: 0,
                            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
                        }}>
                            {insight.icon || icons[insight.type]}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1 }}>
                            <h3 style={{
                                fontSize: '20px',
                                fontWeight: '800',
                                fontFamily: "'Outfit', sans-serif",
                                color: isDarkMode ? '#ffffff' : '#1f2937',
                                margin: '0 0 12px 0',
                                letterSpacing: '-0.02em'
                            }}>
                                {insight.title}
                            </h3>
                            <p style={{
                                fontSize: '15px',
                                color: isDarkMode ? '#cbd5e1' : '#475569',
                                margin: '0 0 16px 0',
                                lineHeight: '1.7'
                            }}>
                                {insight.message}
                            </p>

                            {/* Stats */}
                            {insight.data && (
                                <div style={{
                                    display: 'flex',
                                    gap: '20px',
                                    flexWrap: 'wrap',
                                    paddingTop: '16px',
                                    borderTop: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)'}`
                                }}>
                                    {Object.entries(insight.data).map(([key, value]) => (
                                        <div key={key}>
                                            <p style={{
                                                fontSize: '11px',
                                                color: isDarkMode ? '#94a3b8' : '#64748b',
                                                margin: '0 0 4px 0',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                fontWeight: '600'
                                            }}>
                                                {key.replace(/_/g, ' ')}
                                            </p>
                                            <p style={{
                                                fontSize: '16px',
                                                fontWeight: '700',
                                                color: isDarkMode ? '#ffffff' : '#1f2937',
                                                margin: 0
                                            }}>
                                                {value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

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
                        <p style={{ fontSize: '16px', fontWeight: '600' }}>Analyzing data...</p>
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
                <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                    <div style={{
                        fontSize: '64px',
                        marginBottom: '16px',
                        animation: 'float 3s ease-in-out infinite'
                    }}>
                        🤖
                    </div>
                    <h1 style={{
                        fontSize: '48px',
                        fontWeight: '900',
                        fontFamily: "'Outfit', sans-serif",
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        margin: '0 0 12px 0',
                        letterSpacing: '-0.03em'
                    }}>
                        AI-Powered Insights
                    </h1>
                    <p style={{
                        fontSize: '18px',
                        color: isDarkMode ? '#94a3b8' : '#64748b',
                        margin: '0 0 8px 0',
                        maxWidth: '600px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        lineHeight: '1.6'
                    }}>
                        Smart pattern detection and data-driven recommendations
                    </p>
                    <p style={{
                        fontSize: '13px',
                        color: isDarkMode ? '#64748b' : '#94a3b8',
                        margin: 0,
                        fontStyle: 'italic'
                    }}>
                        Powered by advanced rule-based AI algorithms
                    </p>
                </div>

                {/* Category Filters */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '32px',
                    overflowX: 'auto',
                    paddingBottom: '8px',
                    justifyContent: 'center',
                    flexWrap: 'wrap'
                }}>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            style={{
                                padding: '12px 24px',
                                background: selectedCategory === cat.id
                                    ? cat.color
                                    : isDarkMode
                                        ? 'rgba(30, 41, 59, 0.6)'
                                        : 'rgba(255, 255, 255, 0.8)',
                                color: selectedCategory === cat.id
                                    ? 'white'
                                    : isDarkMode ? '#cbd5e1' : '#64748b',
                                border: selectedCategory === cat.id
                                    ? 'none'
                                    : `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)'}`,
                                borderRadius: '12px',
                                fontSize: '14px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                whiteSpace: 'nowrap',
                                boxShadow: selectedCategory === cat.id
                                    ? '0 4px 12px rgba(102, 126, 234, 0.3)'
                                    : 'none'
                            }}
                            onMouseEnter={(e) => {
                                if (selectedCategory !== cat.id) {
                                    e.target.style.borderColor = '#667eea';
                                    e.target.style.transform = 'translateY(-2px)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (selectedCategory !== cat.id) {
                                    e.target.style.borderColor = isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)';
                                    e.target.style.transform = 'translateY(0)';
                                }
                            }}
                        >
                            <span style={{ fontSize: '18px' }}>{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Insights Grid */}
                {filteredInsights.length > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
                        gap: '24px'
                    }}>
                        {filteredInsights.map((insight, index) => (
                            <InsightCard key={index} insight={insight} />
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
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            margin: '0 0 8px 0',
                            color: isDarkMode ? '#ffffff' : '#1f2937'
                        }}>
                            No Insights Yet
                        </h3>
                        <p style={{
                            fontSize: '14px',
                            color: isDarkMode ? '#94a3b8' : '#64748b',
                            margin: 0
                        }}>
                            AI will generate insights as more data becomes available
                        </p>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
        </div>
    );
};

export default AIInsights;
