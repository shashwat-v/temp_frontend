import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';

const About = () => {
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();

    const features = [
        {
            icon: '🗺️',
            title: 'Interactive Map',
            description: 'Report and track civic issues on a live, real-time map with precise geolocation.',
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        },
        {
            icon: '📊',
            title: 'Analytics Dashboard',
            description: 'Visualize trends, hotspots, and resolution rates with powerful data analytics.',
            color: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
        },
        {
            icon: '🤖',
            title: 'AI Insights',
            description: 'Smart pattern detection and data-driven recommendations powered by AI.',
            color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        },
        {
            icon: '👥',
            title: 'Community Forum',
            description: 'Engage with your community, share ideas, and collaborate on solutions.',
            color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
        },
        {
            icon: '🔔',
            title: 'Real-time Updates',
            description: 'Get notified about issue status changes and community responses instantly.',
            color: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
        },
        {
            icon: '🏛️',
            title: 'Government Integration',
            description: 'Direct communication channel with local authorities for faster resolution.',
            color: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
        }
    ];

    const stats = [
        { value: '10K+', label: 'Issues Reported', icon: '📋' },
        { value: '85%', label: 'Resolution Rate', icon: '✅' },
        { value: '5K+', label: 'Active Users', icon: '👥' },
        { value: '24/7', label: 'Availability', icon: '🔄' }
    ];

    const team = [
        { role: 'Platform', name: 'Civic Engagement', icon: '🌟' },
        { role: 'Technology', name: 'React + Node.js + PostgreSQL', icon: '⚡' },
        { role: 'Design', name: 'Modern UI/UX', icon: '🎨' },
        { role: 'Mission', name: 'Better Communities', icon: '🎯' }
    ];

    const FeatureCard = ({ feature }) => (
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
            border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)'}`,
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            height: '100%'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = isDarkMode
                    ? '0 16px 48px rgba(0, 0, 0, 0.4)'
                    : '0 16px 48px rgba(102, 126, 234, 0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = isDarkMode
                    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                    : '0 8px 32px rgba(102, 126, 234, 0.1)';
            }}
        >
            <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-30%',
                width: '200px',
                height: '200px',
                background: feature.color,
                borderRadius: '50%',
                filter: 'blur(60px)',
                opacity: 0.2,
                pointerEvents: 'none'
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '20px',
                    background: feature.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                    marginBottom: '20px',
                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
                }}>
                    {feature.icon}
                </div>
                <h3 style={{
                    fontSize: '22px',
                    fontWeight: '800',
                    fontFamily: "'Outfit', sans-serif",
                    color: isDarkMode ? '#ffffff' : '#1f2937',
                    margin: '0 0 12px 0',
                    letterSpacing: '-0.02em'
                }}>
                    {feature.title}
                </h3>
                <p style={{
                    fontSize: '15px',
                    color: isDarkMode ? '#cbd5e1' : '#475569',
                    margin: 0,
                    lineHeight: '1.7'
                }}>
                    {feature.description}
                </p>
            </div>
        </div>
    );

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
                {/* Hero Section */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '60px',
                    position: 'relative'
                }}>
                    <div style={{
                        fontSize: '96px',
                        marginBottom: '24px',
                        animation: 'pulse 2s ease-in-out infinite'
                    }}>
                        🏙️
                    </div>
                    <h1 style={{
                        fontSize: '56px',
                        fontWeight: '900',
                        fontFamily: "'Outfit', sans-serif",
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        margin: '0 0 20px 0',
                        letterSpacing: '-0.03em',
                        lineHeight: '1.2'
                    }}>
                        Building Better<br />Communities Together
                    </h1>
                    <p style={{
                        fontSize: '20px',
                        color: isDarkMode ? '#94a3b8' : '#64748b',
                        margin: '0 0 24px 0',
                        maxWidth: '700px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        lineHeight: '1.7'
                    }}>
                        A modern civic engagement platform that empowers citizens to report issues,
                        track progress, and collaborate with local government for positive change.
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        justifyContent: 'center',
                        marginTop: '32px'
                    }}>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                padding: '16px 32px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
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
                            Explore Map
                        </button>
                        <button
                            onClick={() => navigate('/community')}
                            style={{
                                padding: '16px 32px',
                                background: 'none',
                                color: isDarkMode ? '#cbd5e1' : '#64748b',
                                border: `2px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.2)'}`,
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.borderColor = '#667eea';
                                e.target.style.color = '#667eea';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.borderColor = isDarkMode ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.2)';
                                e.target.style.color = isDarkMode ? '#cbd5e1' : '#64748b';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            Join Community
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '24px',
                    marginBottom: '60px'
                }}>
                    {stats.map((stat, index) => (
                        <div key={index} style={{
                            background: isDarkMode
                                ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.4) 100%)'
                                : 'rgba(255, 255, 255, 0.8)',
                            borderRadius: '16px',
                            padding: '28px',
                            textAlign: 'center',
                            border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.15)' : 'rgba(102, 126, 234, 0.1)'}`,
                            transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.borderColor = '#667eea';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.borderColor = isDarkMode ? 'rgba(102, 126, 234, 0.15)' : 'rgba(102, 126, 234, 0.1)';
                            }}
                        >
                            <div style={{ fontSize: '36px', marginBottom: '12px' }}>{stat.icon}</div>
                            <div style={{
                                fontSize: '36px',
                                fontWeight: '900',
                                fontFamily: "'Outfit', sans-serif",
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                margin: '0 0 8px 0'
                            }}>
                                {stat.value}
                            </div>
                            <p style={{
                                fontSize: '14px',
                                color: isDarkMode ? '#94a3b8' : '#64748b',
                                margin: 0,
                                fontWeight: '600'
                            }}>
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Features */}
                <div style={{ marginBottom: '60px' }}>
                    <h2 style={{
                        fontSize: '36px',
                        fontWeight: '800',
                        fontFamily: "'Outfit', sans-serif",
                        color: isDarkMode ? '#ffffff' : '#1f2937',
                        textAlign: 'center',
                        margin: '0 0 40px 0',
                        letterSpacing: '-0.02em'
                    }}>
                        ✨ Powerful Features
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '24px'
                    }}>
                        {features.map((feature, index) => (
                            <FeatureCard key={index} feature={feature} />
                        ))}
                    </div>
                </div>

                {/* How It Works */}
                <div style={{ marginBottom: '60px' }}>
                    <h2 style={{
                        fontSize: '36px',
                        fontWeight: '800',
                        fontFamily: "'Outfit', sans-serif",
                        color: isDarkMode ? '#ffffff' : '#1f2937',
                        textAlign: 'center',
                        margin: '0 0 40px 0',
                        letterSpacing: '-0.02em'
                    }}>
                        🚀 How It Works
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '32px'
                    }}>
                        {[
                            { step: '1', icon: '📍', title: 'Report Issue', desc: 'Spot a problem? Pin it on the map with photos and details.' },
                            { step: '2', icon: '📊', title: 'Track Progress', desc: 'Monitor status updates and see resolution timelines.' },
                            { step: '3', icon: '🤝', title: 'Community Support', desc: 'Upvote issues, join discussions, and collaborate.' },
                            { step: '4', icon: '✅', title: 'Get Results', desc: 'Local authorities resolve issues and update statuses.' }
                        ].map((item, index) => (
                            <div key={index} style={{
                                textAlign: 'center',
                                position: 'relative'
                            }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '40px',
                                    margin: '0 auto 20px auto',
                                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                                    position: 'relative'
                                }}>
                                    {item.icon}
                                    <div style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-8px',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: '#ef4444',
                                        color: 'white',
                                        fontSize: '16px',
                                        fontWeight: '900',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)'
                                    }}>
                                        {item.step}
                                    </div>
                                </div>
                                <h3 style={{
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    color: isDarkMode ? '#ffffff' : '#1f2937',
                                    margin: '0 0 8px 0'
                                }}>
                                    {item.title}
                                </h3>
                                <p style={{
                                    fontSize: '14px',
                                    color: isDarkMode ? '#94a3b8' : '#64748b',
                                    margin: 0,
                                    lineHeight: '1.6'
                                }}>
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team/Tech */}
                <div style={{
                    background: isDarkMode
                        ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 250, 251, 0.95) 100%)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '20px',
                    padding: '48px',
                    boxShadow: isDarkMode
                        ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                        : '0 8px 32px rgba(102, 126, 234, 0.1)',
                    border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)'}`,
                    textAlign: 'center'
                }}>
                    <h2 style={{
                        fontSize: '32px',
                        fontWeight: '800',
                        fontFamily: "'Outfit', sans-serif",
                        color: isDarkMode ? '#ffffff' : '#1f2937',
                        margin: '0 0 32px 0',
                        letterSpacing: '-0.02em'
                    }}>
                        🌟 About This Platform
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '24px'
                    }}>
                        {team.map((item, index) => (
                            <div key={index}>
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{item.icon}</div>
                                <p style={{
                                    fontSize: '12px',
                                    color: isDarkMode ? '#94a3b8' : '#64748b',
                                    margin: '0 0 4px 0',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    fontWeight: '600'
                                }}>
                                    {item.role}
                                </p>
                                <p style={{
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    color: isDarkMode ? '#ffffff' : '#1f2937',
                                    margin: 0
                                }}>
                                    {item.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
        </div>
    );
};

export default About;
