import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { forumAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const NewThread = () => {
    const { isDarkMode } = useTheme();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [categories, setCategories] = useState([]);
    const [categoryId, setCategoryId] = useState(location.state?.categoryId || '');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    const fetchCategories = async () => {
        try {
            const response = await forumAPI.getCategories();
            setCategories(response.data.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!categoryId) newErrors.category = 'Please select a category';
        if (!title.trim()) newErrors.title = 'Title is required';
        if (title.trim().length < 5) newErrors.title = 'Title must be at least 5 characters';
        if (title.trim().length > 200) newErrors.title = 'Title must be less than 200 characters';
        if (!content.trim()) newErrors.content = 'Content is required';
        if (content.trim().length < 10) newErrors.content = 'Content must be at least 10 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);
            const response = await forumAPI.createThread({
                category_id: parseInt(categoryId),
                title: title.trim(),
                content: content.trim()
            });

            const threadId = response.data.data.thread.id;
            navigate(`/community/thread/${threadId}`);
        } catch (error) {
            console.error('Error creating thread:', error);
            alert('Failed to create thread. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
                maxWidth: '800px',
                margin: '0 auto',
                padding: '40px 24px'
            }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <button
                        onClick={() => navigate(-1)}
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
                        ← Back
                    </button>

                    <h1 style={{
                        fontSize: '36px',
                        fontWeight: '900',
                        fontFamily: "'Outfit', sans-serif",
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        margin: '0 0 8px 0',
                        letterSpacing: '-0.03em'
                    }}>
                        Create New Thread
                    </h1>
                    <p style={{
                        fontSize: '14px',
                        color: isDarkMode ? '#94a3b8' : '#64748b',
                        margin: 0
                    }}>
                        Start a new discussion in the community
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
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
                        {/* Category Select */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '700',
                                color: isDarkMode ? '#ffffff' : '#1f2937',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Category <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <select
                                value={categoryId}
                                onChange={(e) => {
                                    setCategoryId(e.target.value);
                                    setErrors({ ...errors, category: '' });
                                }}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    background: isDarkMode ? 'rgba(15, 23, 42, 0.6)' : '#ffffff',
                                    border: `2px solid ${errors.category ? '#ef4444' : (isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)')}`,
                                    borderRadius: '12px',
                                    fontSize: '15px',
                                    color: isDarkMode ? '#ffffff' : '#1f2937',
                                    fontFamily: "'Inter', sans-serif",
                                    cursor: 'pointer',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => !errors.category && (e.target.style.borderColor = '#667eea')}
                                onBlur={(e) => !errors.category && (e.target.style.borderColor = isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)')}
                            >
                                <option value="">Select a category...</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.icon} {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category && (
                                <p style={{
                                    fontSize: '12px',
                                    color: '#ef4444',
                                    margin: '6px 0 0 0',
                                    fontWeight: '600'
                                }}>
                                    {errors.category}
                                </p>
                            )}
                        </div>

                        {/* Title Input */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '700',
                                color: isDarkMode ? '#ffffff' : '#1f2937',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Title <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value);
                                    setErrors({ ...errors, title: '' });
                                }}
                                placeholder="What's your thread about?"
                                maxLength={200}
                                style={{
                                    width: '100%',
                                    padding: '14px 16px',
                                    background: isDarkMode ? 'rgba(15, 23, 42, 0.6)' : '#ffffff',
                                    border: `2px solid ${errors.title ? '#ef4444' : (isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)')}`,
                                    borderRadius: '12px',
                                    fontSize: '15px',
                                    color: isDarkMode ? '#ffffff' : '#1f2937',
                                    fontFamily: "'Inter', sans-serif",
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => !errors.title && (e.target.style.borderColor = '#667eea')}
                                onBlur={(e) => !errors.title && (e.target.style.borderColor = isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)')}
                            />
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: '6px'
                            }}>
                                {errors.title ? (
                                    <p style={{
                                        fontSize: '12px',
                                        color: '#ef4444',
                                        margin: 0,
                                        fontWeight: '600'
                                    }}>
                                        {errors.title}
                                    </p>
                                ) : (
                                    <span></span>
                                )}
                                <p style={{
                                    fontSize: '12px',
                                    color: isDarkMode ? '#94a3b8' : '#64748b',
                                    margin: 0
                                }}>
                                    {title.length}/200
                                </p>
                            </div>
                        </div>

                        {/* Content Textarea */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '14px',
                                fontWeight: '700',
                                color: isDarkMode ? '#ffffff' : '#1f2937',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                            }}>
                                Content <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => {
                                    setContent(e.target.value);
                                    setErrors({ ...errors, content: '' });
                                }}
                                placeholder="Share your thoughts in detail..."
                                rows={12}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: isDarkMode ? 'rgba(15, 23, 42, 0.6)' : '#ffffff',
                                    border: `2px solid ${errors.content ? '#ef4444' : (isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)')}`,
                                    borderRadius: '12px',
                                    fontSize: '15px',
                                    color: isDarkMode ? '#ffffff' : '#1f2937',
                                    fontFamily: "'Inter', sans-serif",
                                    lineHeight: '1.7',
                                    resize: 'vertical',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => !errors.content && (e.target.style.borderColor = '#667eea')}
                                onBlur={(e) => !errors.content && (e.target.style.borderColor = isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)')}
                            />
                            {errors.content && (
                                <p style={{
                                    fontSize: '12px',
                                    color: '#ef4444',
                                    margin: '6px 0 0 0',
                                    fontWeight: '600'
                                }}>
                                    {errors.content}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                style={{
                                    padding: '12px 24px',
                                    background: 'none',
                                    border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.2)'}`,
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    color: isDarkMode ? '#cbd5e1' : '#64748b',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.borderColor = '#667eea';
                                    e.target.style.color = '#667eea';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.borderColor = isDarkMode ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.2)';
                                    e.target.style.color = isDarkMode ? '#cbd5e1' : '#64748b';
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: '12px 32px',
                                    background: loading
                                        ? (isDarkMode ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.2)')
                                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.3s',
                                    boxShadow: loading ? 'none' : '0 4px 16px rgba(102, 126, 234, 0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                                onMouseEnter={(e) => {
                                    if (!loading) {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!loading) {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.3)';
                                    }
                                }}
                            >
                                {loading ? (
                                    <>
                                        <div style={{
                                            width: '16px',
                                            height: '16px',
                                            border: '2px solid rgba(255, 255, 255, 0.3)',
                                            borderTopColor: '#ffffff',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite'
                                        }} />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        ✨ Create Thread
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default NewThread;
