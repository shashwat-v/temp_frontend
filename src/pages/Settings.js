import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const [settings, setSettings] = useState({
        emailNotifications: true,
        proximityAlerts: false,
        proximityRadius: 5000, // meters
        weeklyDigest: true,
        issueUpdates: true
    });
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        // Load user preferences from user object
        if (user?.notification_preferences) {
            setSettings({
                emailNotifications: user.notification_preferences.email || true,
                proximityAlerts: user.notification_preferences.proximity_alerts || false,
                proximityRadius: user.notification_preferences.proximity_radius || 5000,
                weeklyDigest: user.notification_preferences.weekly_digest || true,
                issueUpdates: user.notification_preferences.issue_updates || true
            });
        }
    }, [isAuthenticated, user, navigate]);

    const handleToggle = (key) => {
        setSettings({ ...settings, [key]: !settings[key] });
    };

    const handleRadiusChange = (e) => {
        setSettings({ ...settings, proximityRadius: parseInt(e.target.value) });
    };

    const handleSaveSettings = async () => {
        try {
            setLoading(true);
            setSuccessMessage('');

            await userAPI.updateNotificationPreferences({
                email: settings.emailNotifications,
                proximity_alerts: settings.proximityAlerts,
                proximity_radius: settings.proximityRadius,
                weekly_digest: settings.weeklyDigest,
                issue_updates: settings.issueUpdates
            });

            setSuccessMessage('Settings saved successfully!');
        } catch (error) {
            console.error('Failed to save settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete your account? This action cannot be undone.'
        );

        if (confirmed) {
            try {
                await userAPI.deleteAccount();
                logout();
                navigate('/');
            } catch (error) {
                console.error('Failed to delete account:', error);
                alert('Failed to delete account. Please try again.');
            }
        }
    };

    const ToggleSwitch = ({ checked, onChange, label, description }) => (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
            background: isDarkMode ? 'rgba(15, 23, 42, 0.4)' : 'rgba(249, 250, 251, 0.8)',
            borderRadius: '12px',
            marginBottom: '12px',
            border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.15)' : 'rgba(102, 126, 234, 0.1)'}`,
            transition: 'all 0.2s'
        }}>
            <div style={{ flex: 1 }}>
                <div style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    color: isDarkMode ? '#ffffff' : '#1f2937',
                    marginBottom: '4px'
                }}>
                    {label}
                </div>
                <div style={{
                    fontSize: '13px',
                    color: isDarkMode ? '#94a3b8' : '#64748b'
                }}>
                    {description}
                </div>
            </div>
            <div
                onClick={onChange}
                style={{
                    width: '52px',
                    height: '28px',
                    background: checked
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : (isDarkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(203, 213, 225, 0.5)'),
                    borderRadius: '14px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: checked ? '0 2px 8px rgba(102, 126, 234, 0.3)' : 'none'
                }}
            >
                <div style={{
                    width: '22px',
                    height: '22px',
                    background: 'white',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '3px',
                    left: checked ? '27px' : '3px',
                    transition: 'left 0.3s ease',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }} />
            </div>
        </div>
    );

    return (
        <div style={{
            width: '100%',
            minHeight: '100vh',
            background: isDarkMode ? '#0f172a' : '#f9fafb',
            transition: 'background 0.3s ease'
        }}>
            <Navbar />

            <div style={{
                maxWidth: '800px',
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
                        ⚙️ Settings
                    </h1>
                    <p style={{
                        fontSize: '16px',
                        color: isDarkMode ? '#94a3b8' : '#64748b',
                        margin: 0
                    }}>
                        Customize your experience and preferences
                    </p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        padding: '16px 20px',
                        borderRadius: '12px',
                        marginBottom: '24px',
                        fontSize: '14px',
                        fontWeight: '600',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}>
                        ✅ {successMessage}
                    </div>
                )}

                {/* Appearance Settings */}
                <div style={{
                    background: isDarkMode
                        ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 250, 251, 0.95) 100%)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    padding: '32px',
                    marginBottom: '24px',
                    boxShadow: isDarkMode
                        ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                        : '0 8px 32px rgba(102, 126, 234, 0.1)',
                    border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)'}`
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '800',
                        fontFamily: "'Outfit', sans-serif",
                        color: isDarkMode ? '#ffffff' : '#1f2937',
                        margin: '0 0 24px 0'
                    }}>
                        🎨 Appearance
                    </h2>

                    <ToggleSwitch
                        checked={isDarkMode}
                        onChange={toggleTheme}
                        label="Dark Mode"
                        description="Use dark theme across the application"
                    />
                </div>

                {/* Notification Settings */}
                <div style={{
                    background: isDarkMode
                        ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 250, 251, 0.95) 100%)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    padding: '32px',
                    marginBottom: '24px',
                    boxShadow: isDarkMode
                        ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                        : '0 8px 32px rgba(102, 126, 234, 0.1)',
                    border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)'}`
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '800',
                        fontFamily: "'Outfit', sans-serif",
                        color: isDarkMode ? '#ffffff' : '#1f2937',
                        margin: '0 0 24px 0'
                    }}>
                        🔔 Notifications
                    </h2>

                    <ToggleSwitch
                        checked={settings.emailNotifications}
                        onChange={() => handleToggle('emailNotifications')}
                        label="Email Notifications"
                        description="Receive email updates about your issues"
                    />

                    <ToggleSwitch
                        checked={settings.issueUpdates}
                        onChange={() => handleToggle('issueUpdates')}
                        label="Issue Status Updates"
                        description="Get notified when your reported issues are updated"
                    />

                    <ToggleSwitch
                        checked={settings.weeklyDigest}
                        onChange={() => handleToggle('weeklyDigest')}
                        label="Weekly Digest"
                        description="Receive a weekly summary of community activity"
                    />

                    <ToggleSwitch
                        checked={settings.proximityAlerts}
                        onChange={() => handleToggle('proximityAlerts')}
                        label="Proximity Alerts"
                        description="Get notified about new issues near your location"
                    />

                    {settings.proximityAlerts && (
                        <div style={{
                            padding: '20px',
                            background: isDarkMode ? 'rgba(15, 23, 42, 0.4)' : 'rgba(249, 250, 251, 0.8)',
                            borderRadius: '12px',
                            border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.15)' : 'rgba(102, 126, 234, 0.1)'}`,
                            marginTop: '-12px',
                            marginBottom: '12px'
                        }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '700',
                                color: isDarkMode ? '#ffffff' : '#1f2937',
                                marginBottom: '12px'
                            }}>
                                Alert Radius: {(settings.proximityRadius / 1000).toFixed(1)} km
                            </label>
                            <input
                                type="range"
                                min="1000"
                                max="10000"
                                step="500"
                                value={settings.proximityRadius}
                                onChange={handleRadiusChange}
                                style={{
                                    width: '100%',
                                    height: '6px',
                                    background: isDarkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(203, 213, 225, 0.5)',
                                    borderRadius: '3px',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            />
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: '8px',
                                fontSize: '12px',
                                color: isDarkMode ? '#64748b' : '#94a3b8'
                            }}>
                                <span>1 km</span>
                                <span>10 km</span>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleSaveSettings}
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px 24px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '700',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            marginTop: '12px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        {loading ? 'Saving...' : '💾 Save Notification Settings'}
                    </button>
                </div>

                {/* Privacy & Security */}
                <div style={{
                    background: isDarkMode
                        ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.95) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 250, 251, 0.95) 100%)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    padding: '32px',
                    marginBottom: '24px',
                    boxShadow: isDarkMode
                        ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                        : '0 8px 32px rgba(102, 126, 234, 0.1)',
                    border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)'}`
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '800',
                        fontFamily: "'Outfit', sans-serif",
                        color: isDarkMode ? '#ffffff' : '#1f2937',
                        margin: '0 0 24px 0'
                    }}>
                        🔒 Privacy & Security
                    </h2>

                    <button
                        onClick={() => navigate('/profile')}
                        style={{
                            width: '100%',
                            padding: '14px 24px',
                            background: isDarkMode ? 'rgba(15, 23, 42, 0.6)' : 'white',
                            color: isDarkMode ? '#cbd5e1' : '#475569',
                            border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.2)'}`,
                            borderRadius: '12px',
                            fontSize: '14px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            marginBottom: '12px',
                            transition: 'all 0.2s',
                            textAlign: 'left',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = isDarkMode
                                ? '0 4px 12px rgba(102, 126, 234, 0.2)'
                                : '0 4px 12px rgba(102, 126, 234, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        <span>🔑 Change Password</span>
                        <span>→</span>
                    </button>
                </div>

                {/* Danger Zone */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    padding: '32px',
                    boxShadow: '0 8px 32px rgba(239, 68, 68, 0.1)',
                    border: '2px solid rgba(239, 68, 68, 0.3)'
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '800',
                        fontFamily: "'Outfit', sans-serif",
                        color: '#ef4444',
                        margin: '0 0 12px 0'
                    }}>
                        ⚠️ Danger Zone
                    </h2>
                    <p style={{
                        fontSize: '14px',
                        color: isDarkMode ? '#fca5a5' : '#dc2626',
                        marginBottom: '20px'
                    }}>
                        Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                        onClick={handleDeleteAccount}
                        style={{
                            padding: '12px 24px',
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
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
                        🗑️ Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
