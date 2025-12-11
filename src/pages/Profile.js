import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { isDarkMode } = useTheme();
    const { user, updateUser, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (user) {
            setFormData({
                fullName: user.full_name || '',
                email: user.email || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    }, [isAuthenticated, user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validateProfile = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }
        return newErrors;
    };

    const validatePassword = () => {
        const newErrors = {};
        if (formData.newPassword) {
            if (!formData.currentPassword) {
                newErrors.currentPassword = 'Current password required to change password';
            }
            if (formData.newPassword.length < 8) {
                newErrors.newPassword = 'New password must be at least 8 characters';
            }
            if (formData.newPassword !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }
        return newErrors;
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const profileErrors = validateProfile();

        if (Object.keys(profileErrors).length > 0) {
            setErrors(profileErrors);
            return;
        }

        try {
            setLoading(true);
            setSuccessMessage('');

            await userAPI.updateProfile({
                fullName: formData.fullName
            });

            updateUser({ ...user, full_name: formData.fullName });
            setSuccessMessage('Profile updated successfully!');
            setEditMode(false);
        } catch (error) {
            setErrors({ submit: error.response?.data?.error || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        const passwordErrors = validatePassword();

        if (Object.keys(passwordErrors).length > 0) {
            setErrors(passwordErrors);
            return;
        }

        try {
            setLoading(true);
            setSuccessMessage('');

            await userAPI.changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });

            setSuccessMessage('Password changed successfully!');
            setFormData({
                ...formData,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            setErrors({ password: error.response?.data?.error || 'Failed to change password' });
        } finally {
            setLoading(false);
        }
    };

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
                        👤 My Profile
                    </h1>
                    <p style={{
                        fontSize: '16px',
                        color: isDarkMode ? '#94a3b8' : '#64748b',
                        margin: 0
                    }}>
                        Manage your account settings and preferences
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

                {/* Profile Information */}
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
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '24px'
                    }}>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: '800',
                            fontFamily: "'Outfit', sans-serif",
                            color: isDarkMode ? '#ffffff' : '#1f2937',
                            margin: 0
                        }}>
                            Profile Information
                        </h2>
                        {!editMode && (
                            <button
                                onClick={() => setEditMode(true)}
                                style={{
                                    padding: '10px 20px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                            >
                                ✏️ Edit
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleUpdateProfile}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '700',
                                color: isDarkMode ? '#ffffff' : '#1f2937',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                disabled={!editMode}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    background: editMode
                                        ? (isDarkMode ? 'rgba(15, 23, 42, 0.6)' : '#ffffff')
                                        : (isDarkMode ? 'rgba(15, 23, 42, 0.3)' : '#f9fafb'),
                                    border: `2px solid ${errors.fullName ? '#ef4444' : (isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)')}`,
                                    borderRadius: '12px',
                                    fontSize: '15px',
                                    color: isDarkMode ? '#ffffff' : '#1f2937',
                                    fontFamily: "'Inter', sans-serif",
                                    cursor: editMode ? 'text' : 'not-allowed'
                                }}
                            />
                            {errors.fullName && (
                                <p style={{ fontSize: '12px', color: '#ef4444', margin: '6px 0 0 0' }}>
                                    {errors.fullName}
                                </p>
                            )}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '700',
                                color: isDarkMode ? '#ffffff' : '#1f2937',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    background: isDarkMode ? 'rgba(15, 23, 42, 0.3)' : '#f9fafb',
                                    border: `2px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)'}`,
                                    borderRadius: '12px',
                                    fontSize: '15px',
                                    color: isDarkMode ? '#94a3b8' : '#64748b',
                                    fontFamily: "'Inter', sans-serif",
                                    cursor: 'not-allowed'
                                }}
                            />
                            <p style={{
                                fontSize: '12px',
                                color: isDarkMode ? '#64748b' : '#94a3b8',
                                margin: '6px 0 0 0',
                                fontStyle: 'italic'
                            }}>
                                Email cannot be changed
                            </p>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '700',
                                color: isDarkMode ? '#ffffff' : '#1f2937',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Role
                            </label>
                            <div style={{
                                padding: '14px 16px',
                                background: isDarkMode ? 'rgba(15, 23, 42, 0.3)' : '#f9fafb',
                                border: `2px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)'}`,
                                borderRadius: '12px',
                                fontSize: '15px',
                                color: isDarkMode ? '#ffffff' : '#1f2937',
                                fontWeight: '600',
                                textTransform: 'capitalize'
                            }}>
                                {user?.role || 'User'}
                            </div>
                        </div>

                        {editMode && (
                            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditMode(false);
                                        setFormData({
                                            ...formData,
                                            fullName: user.full_name || ''
                                        });
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: '12px 24px',
                                        background: 'none',
                                        border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.2)'}`,
                                        borderRadius: '12px',
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        color: isDarkMode ? '#cbd5e1' : '#64748b',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        flex: 1,
                                        padding: '12px 24px',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: loading ? 0.7 : 1
                                    }}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                {/* Change Password */}
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
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '800',
                        fontFamily: "'Outfit', sans-serif",
                        color: isDarkMode ? '#ffffff' : '#1f2937',
                        margin: '0 0 24px 0'
                    }}>
                        🔒 Change Password
                    </h2>

                    <form onSubmit={handleChangePassword}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '700',
                                color: isDarkMode ? '#ffffff' : '#1f2937',
                                marginBottom: '8px'
                            }}>
                                Current Password
                            </label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    background: isDarkMode ? 'rgba(15, 23, 42, 0.6)' : '#ffffff',
                                    border: `2px solid ${errors.currentPassword ? '#ef4444' : (isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)')}`,
                                    borderRadius: '12px',
                                    fontSize: '15px',
                                    color: isDarkMode ? '#ffffff' : '#1f2937'
                                }}
                            />
                            {errors.currentPassword && (
                                <p style={{ fontSize: '12px', color: '#ef4444', margin: '6px 0 0 0' }}>
                                    {errors.currentPassword}
                                </p>
                            )}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '700',
                                color: isDarkMode ? '#ffffff' : '#1f2937',
                                marginBottom: '8px'
                            }}>
                                New Password
                            </label>
                            <input
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    background: isDarkMode ? 'rgba(15, 23, 42, 0.6)' : '#ffffff',
                                    border: `2px solid ${errors.newPassword ? '#ef4444' : (isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)')}`,
                                    borderRadius: '12px',
                                    fontSize: '15px',
                                    color: isDarkMode ? '#ffffff' : '#1f2937'
                                }}
                            />
                            {errors.newPassword && (
                                <p style={{ fontSize: '12px', color: '#ef4444', margin: '6px 0 0 0' }}>
                                    {errors.newPassword}
                                </p>
                            )}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '700',
                                color: isDarkMode ? '#ffffff' : '#1f2937',
                                marginBottom: '8px'
                            }}>
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    background: isDarkMode ? 'rgba(15, 23, 42, 0.6)' : '#ffffff',
                                    border: `2px solid ${errors.confirmPassword ? '#ef4444' : (isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)')}`,
                                    borderRadius: '12px',
                                    fontSize: '15px',
                                    color: isDarkMode ? '#ffffff' : '#1f2937'
                                }}
                            />
                            {errors.confirmPassword && (
                                <p style={{ fontSize: '12px', color: '#ef4444', margin: '6px 0 0 0' }}>
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {errors.password && (
                            <div style={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid #ef4444',
                                borderRadius: '8px',
                                padding: '12px',
                                marginBottom: '16px',
                                color: '#ef4444',
                                fontSize: '14px'
                            }}>
                                {errors.password}
                            </div>
                        )}

                        <button
                            type="submit"
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
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Changing Password...' : 'Change Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
