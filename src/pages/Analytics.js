import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyticsAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';
import {
    LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';

const Analytics = () => {
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();

    const [overview, setOverview] = useState(null);
    const [trends, setTrends] = useState(null);
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('week');

    useEffect(() => {
        fetchAnalytics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPeriod]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const [overviewRes, trendsRes, insightsRes] = await Promise.all([
                analyticsAPI.getOverview(),
                analyticsAPI.getTrends({ period: selectedPeriod }),
                analyticsAPI.getInsights()
            ]);

            setOverview(overviewRes.data.data);
            setTrends(trendsRes.data.data);
            setInsights(insightsRes.data.data.insights);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#6b7280', '#f59e0b', '#8b5cf6'];

    const StatCard = ({ title, value, subtitle, icon, gradient, trend }) => (
        <div style={{
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
            {/* Gradient Background */}
            <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '120px',
                height: '120px',
                background: gradient,
                borderRadius: '50%',
                filter: 'blur(40px)',
                opacity: 0.3,
                pointerEvents: 'none'
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                        <p style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: isDarkMode ? '#94a3b8' : '#64748b',
                            marginBottom: '8px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            {title}
                        </p>
                        <h2 style={{
                            fontSize: '36px',
                            fontWeight: '800',
                            fontFamily: "'Outfit', sans-serif",
                            color: isDarkMode ? '#ffffff' : '#1f2937',
                            margin: 0,
                            letterSpacing: '-0.02em'
                        }}>
                            {value}
                        </h2>
                    </div>
                    <div style={{
                        fontSize: '32px',
                        opacity: 0.8
                    }}>
                        {icon}
                    </div>
                </div>

                {subtitle && (
                    <p style={{
                        fontSize: '13px',
                        color: isDarkMode ? '#cbd5e1' : '#6b7280',
                        margin: 0
                    }}>
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );

    const InsightCard = ({ insight }) => {
        const icons = {
            warning: '⏰',
            alert: '📊',
            info: '🔥',
            success: '✅'
        };

        const gradients = {
            warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            alert: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        };

        return (
            <div style={{
                background: isDarkMode
                    ? 'rgba(30, 41, 59, 0.6)'
                    : 'rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                padding: '16px 20px',
                border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)'}`,
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
                transition: 'all 0.2s'
            }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = isDarkMode
                        ? 'rgba(30, 41, 59, 0.8)'
                        : 'rgba(255, 255, 255, 1)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = isDarkMode
                        ? 'rgba(30, 41, 59, 0.6)'
                        : 'rgba(255, 255, 255, 0.9)';
                }}
            >
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: gradients[insight.type],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0
                }}>
                    {insight.icon || icons[insight.type]}
                </div>
                <div style={{ flex: 1 }}>
                    <h4 style={{
                        margin: '0 0 4px 0',
                        fontSize: '15px',
                        fontWeight: '700',
                        color: isDarkMode ? '#ffffff' : '#1f2937'
                    }}>
                        {insight.title}
                    </h4>
                    <p style={{
                        margin: 0,
                        fontSize: '13px',
                        color: isDarkMode ? '#cbd5e1' : '#6b7280',
                        lineHeight: '1.5'
                    }}>
                        {insight.message}
                    </p>
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
                        <p style={{ fontSize: '16px', fontWeight: '600' }}>Loading Analytics...</p>
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
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '40px 24px'
            }}>
                {/* Header */}
                <div style={{ marginBottom: '40px' }}>
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
                        Analytics Dashboard
                    </h1>
                    <p style={{
                        fontSize: '16px',
                        color: isDarkMode ? '#94a3b8' : '#64748b',
                        margin: 0
                    }}>
                        Real-time insights and trends from civic reported issues
                    </p>
                </div>

                {/* Overview Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '24px',
                    marginBottom: '40px'
                }}>
                    <StatCard
                        title="Total Issues"
                        value={overview?.overview?.total_issues || 0}
                        icon="📋"
                        gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    />
                    <StatCard
                        title="Open Issues"
                        value={overview?.overview?.open_issues || 0}
                        icon="🔴"
                        subtitle={`${overview?.overview?.in_progress_issues || 0} in progress`}
                        gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
                    />
                    <StatCard
                        title="Resolved"
                        value={overview?.overview?.resolved_issues || 0}
                        icon="✅"
                        subtitle={`${Math.round((overview?.overview?.resolved_issues / overview?.overview?.total_issues) * 100) || 0}% resolution rate`}
                        gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                    />
                    <StatCard
                        title="Avg Resolution"
                        value={`${Math.round(overview?.overview?.avg_resolution_days || 0)}d`}
                        icon="⏱️"
                        subtitle="Average time to resolve"
                        gradient="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                    />
                </div>

                {/* AI Insights */}
                {insights.length > 0 && (
                    <div style={{
                        marginBottom: '40px',
                        background: isDarkMode
                            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%)'
                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 250, 251, 0.95) 100%)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '16px',
                        padding: '32px',
                        boxShadow: isDarkMode
                            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                            : '0 8px 32px rgba(102, 126, 234, 0.1)',
                        border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)'}`
                    }}>
                        <h3 style={{
                            fontSize: '24px',
                            fontWeight: '800',
                            fontFamily: "'Outfit', sans-serif",
                            color: isDarkMode ? '#ffffff' : '#1f2937',
                            marginBottom: '24px',
                            letterSpacing: '-0.02em'
                        }}>
                            🤖 Smart Insights
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {insights.map((insight, index) => (
                                <InsightCard key={index} insight={insight} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Charts Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
                    gap: '24px',
                    marginBottom: '40px'
                }}>
                    {/* Category Breakdown */}
                    <div style={{
                        background: isDarkMode
                            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%)'
                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 250, 251, 0.95) 100%)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '16px',
                        padding: '32px',
                        boxShadow: isDarkMode
                            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                            : '0 8px 32px rgba(102, 126, 234, 0.1)',
                        border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)'}`
                    }}>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            color: isDarkMode ? '#ffffff' : '#1f2937',
                            marginBottom: '24px'
                        }}>
                            Issues by Category
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={overview?.categories || []}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ category, count }) => `${category}: ${count}`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {overview?.categories.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        background: isDarkMode ? '#1e293b' : '#ffffff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Trends Chart */}
                    <div style={{
                        background: isDarkMode
                            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%)'
                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 250, 251, 0.95) 100%)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '16px',
                        padding: '32px',
                        boxShadow: isDarkMode
                            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                            : '0 8px 32px rgba(102, 126, 234, 0.1)',
                        border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)'}`
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{
                                fontSize: '20px',
                                fontWeight: '700',
                                color: isDarkMode ? '#ffffff' : '#1f2937',
                                margin: 0
                            }}>
                                Issues Trend
                            </h3>
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.3)' : '#e5e7eb'}`,
                                    background: isDarkMode ? 'rgba(15, 23, 42, 0.6)' : '#ffffff',
                                    color: isDarkMode ? '#ffffff' : '#1f2937',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="week">Last Week</option>
                                <option value="month">Last Month</option>
                                <option value="year">Last Year</option>
                            </select>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={trends?.issuesTrend || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e5e7eb'} />
                                <XAxis
                                    dataKey="period"
                                    tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                                    stroke={isDarkMode ? '#94a3b8' : '#64748b'}
                                />
                                <YAxis stroke={isDarkMode ? '#94a3b8' : '#64748b'} />
                                <Tooltip
                                    contentStyle={{
                                        background: isDarkMode ? '#1e293b' : '#ffffff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="total" stroke="#667eea" strokeWidth={3} name="Total Issues" />
                                <Line type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={3} name="Resolved" />
                                <Line type="monotone" dataKey="open" stroke="#ef4444" strokeWidth={3} name="Open" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Issues */}
                <div style={{
                    background: isDarkMode
                        ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 250, 251, 0.95) 100%)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    padding: '32px',
                    boxShadow: isDarkMode
                        ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                        : '0 8px 32px rgba(102, 126, 234, 0.1)',
                    border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)'}`
                }}>
                    <h3 style={{
                        fontSize: '24px',
                        fontWeight: '800',
                        fontFamily: "'Outfit', sans-serif",
                        color: isDarkMode ? '#ffffff' : '#1f2937',
                        marginBottom: '24px',
                        letterSpacing: '-0.02em'
                    }}>
                        🔥 Most Upvoted Issues
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {overview?.topIssues?.map((issue, index) => (
                            <div
                                key={issue.id}
                                style={{
                                    padding: '16px 20px',
                                    background: isDarkMode ? 'rgba(15, 23, 42, 0.4)' : 'rgba(249, 250, 251, 0.8)',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)'}`
                                }}
                                onClick={() => navigate('/')}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = isDarkMode ? 'rgba(15, 23, 42, 0.6)' : 'rgba(249, 250, 251, 1)';
                                    e.currentTarget.style.transform = 'translateX(4px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = isDarkMode ? 'rgba(15, 23, 42, 0.4)' : 'rgba(249, 250, 251, 0.8)';
                                    e.currentTarget.style.transform = 'translateX(0)';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{
                                        fontSize: '20px',
                                        fontWeight: '700',
                                        color: isDarkMode ? '#667eea' : '#667eea',
                                        minWidth: '24px'
                                    }}>
                                        #{index + 1}
                                    </div>
                                    <div>
                                        <h4 style={{
                                            margin: '0 0 4px 0',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            color: isDarkMode ? '#ffffff' : '#1f2937'
                                        }}>
                                            {issue.title}
                                        </h4>
                                        <p style={{
                                            margin: 0,
                                            fontSize: '13px',
                                            color: isDarkMode ? '#94a3b8' : '#64748b'
                                        }}>
                                            {issue.category} • {issue.status}
                                        </p>
                                    </div>
                                </div>
                                <div style={{
                                    padding: '8px 16px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    borderRadius: '20px',
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: '700'
                                }}>
                                    ↑ {issue.upvote_count}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default Analytics;
