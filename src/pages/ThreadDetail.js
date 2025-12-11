import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { forumAPI } from '../services/api';
import Navbar from '../components/Navbar';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const ThreadDetail = () => {
    const { isDarkMode } = useTheme();
    const { isAuthenticated } = useAuth();
    const { threadId } = useParams();
    const navigate = useNavigate();

    const [thread, setThread] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyContent, setReplyContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchThread();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [threadId]);

    const fetchThread = async () => {
        try {
            setLoading(true);
            const response = await forumAPI.getThread(threadId);
            setThread(response.data.data.thread);
            setPosts(response.data.data.posts);
        } catch (error) {
            console.error('Error fetching thread:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        try {
            setSubmitting(true);
            await forumAPI.replyToThread(threadId, replyContent);
            setReplyContent('');
            await fetchThread(); // Refresh to show new post
        } catch (error) {
            console.error('Error posting reply:', error);
            alert('Failed to post reply. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpvote = async (postId, isUpvoted) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            if (isUpvoted) {
                await forumAPI.removeUpvoteFromPost(postId);
            } else {
                await forumAPI.upvotePost(postId);
            }
            await fetchThread(); // Refresh to update counts
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    const PostCard = ({ post, isOP = false }) => (
        <div style={{
            background: isDarkMode
                ? isOP
                    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.4) 100%)'
                : isOP
                    ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.05) 100%)'
                    : 'rgba(255, 255, 255, 0.8)',
            borderRadius: '12px',
            padding: '24px',
            border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.15)' : 'rgba(102, 126, 234, 0.1)'}`,
            position: 'relative'
        }}>
            {isOP && (
                <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '4px 12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: 'white',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    Original Post
                </div>
            )}

            <div style={{ display: 'flex', gap: '20px' }}>
                {/* Author Info */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: '80px'
                }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        marginBottom: '8px'
                    }}>
                        👤
                    </div>
                    <p style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: isDarkMode ? '#ffffff' : '#1f2937',
                        margin: '0 0 4px 0',
                        textAlign: 'center'
                    }}>
                        {post.author_name || 'Anonymous'}
                    </p>
                    <p style={{
                        fontSize: '11px',
                        color: isDarkMode ? '#94a3b8' : '#64748b',
                        margin: 0,
                        textAlign: 'center'
                    }}>
                        {format(new Date(post.created_at), 'MMM dd, yyyy')}
                    </p>
                </div>

                {/* Post Content */}
                <div style={{ flex: 1 }}>
                    <p style={{
                        fontSize: '15px',
                        color: isDarkMode ? '#e2e8f0' : '#1f2937',
                        lineHeight: '1.7',
                        margin: '0 0 16px 0',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {post.content}
                    </p>

                    {/* Actions */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        paddingTop: '12px',
                        borderTop: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)'}`
                    }}>
                        <button
                            onClick={() => handleUpvote(post.id, post.user_upvoted)}
                            style={{
                                background: post.user_upvoted
                                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                    : 'none',
                                border: post.user_upvoted
                                    ? 'none'
                                    : `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.2)'}`,
                                borderRadius: '8px',
                                padding: '6px 12px',
                                color: post.user_upvoted ? 'white' : (isDarkMode ? '#cbd5e1' : '#64748b'),
                                fontSize: '13px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                if (!post.user_upvoted) {
                                    e.target.style.borderColor = '#667eea';
                                    e.target.style.color = '#667eea';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!post.user_upvoted) {
                                    e.target.style.borderColor = isDarkMode ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.2)';
                                    e.target.style.color = isDarkMode ? '#cbd5e1' : '#64748b';
                                }
                            }}
                        >
                            ↑ {post.upvote_count || 0}
                        </button>

                        <div style={{
                            fontSize: '11px',
                            color: isDarkMode ? '#94a3b8' : '#64748b'
                        }}>
                            {format(new Date(post.created_at), 'h:mm a')}
                        </div>
                    </div>
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
                        <p style={{ fontSize: '16px', fontWeight: '600' }}>Loading Thread...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!thread) {
        return (
            <div style={{ minHeight: '100vh', background: isDarkMode ? '#0f172a' : '#f9fafb' }}>
                <Navbar />
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 'calc(100vh - 72px)',
                    color: isDarkMode ? '#cbd5e1' : '#6b7280',
                    textAlign: 'center'
                }}>
                    <div>
                        <p style={{ fontSize: '64px', margin: '0 0 16px 0' }}>🔍</p>
                        <p style={{ fontSize: '18px', fontWeight: '600' }}>Thread not found</p>
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
                maxWidth: '900px',
                margin: '0 auto',
                padding: '40px 24px'
            }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <button
                        onClick={() => navigate(`/community/category/${thread.category_id || 1}`)}
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
                        ← Back to Threads
                    </button>

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
                        <div style={{
                            display: 'inline-block',
                            padding: '6px 12px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '700',
                            color: 'white',
                            marginBottom: '16px'
                        }}>
                            {thread.category_icon} {thread.category_name}
                        </div>

                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: '900',
                            fontFamily: "'Outfit', sans-serif",
                            color: isDarkMode ? '#ffffff' : '#1f2937',
                            margin: '0 0 16px 0',
                            letterSpacing: '-0.02em',
                            lineHeight: '1.3'
                        }}>
                            {thread.title}
                        </h1>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px',
                            flexWrap: 'wrap',
                            fontSize: '13px',
                            color: isDarkMode ? '#94a3b8' : '#64748b'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>👤</span>
                                <span style={{ fontWeight: '600' }}>{thread.author_name || 'Anonymous'}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>💬</span>
                                <span>{thread.post_count || 0} replies</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>👁️</span>
                                <span>{thread.view_count || 0} views</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>🕒</span>
                                <span>{format(new Date(thread.created_at), 'MMM dd, yyyy h:mm a')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Original Post */}
                <div style={{ marginBottom: '24px' }}>
                    <PostCard post={{
                        ...thread,
                        content: thread.content,
                        author_name: thread.author_name,
                        created_at: thread.created_at
                    }} isOP={true} />
                </div>

                {/* Replies */}
                {posts.length > 0 && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        marginBottom: '24px'
                    }}>
                        <h3 style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            color: isDarkMode ? '#ffffff' : '#1f2937',
                            margin: '16px 0'
                        }}>
                            💬 Replies ({posts.length})
                        </h3>
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}

                {/* Reply Form */}
                {isAuthenticated && !thread.is_locked ? (
                    <div style={{
                        background: isDarkMode
                            ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.4) 100%)'
                            : 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.15)' : 'rgba(102, 126, 234, 0.1)'}`
                    }}>
                        <h3 style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: isDarkMode ? '#ffffff' : '#1f2937',
                            margin: '0 0 16px 0'
                        }}>
                            💬 Post a Reply
                        </h3>
                        <form onSubmit={handleReply}>
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Share your thoughts..."
                                rows={6}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    background: isDarkMode ? 'rgba(15, 23, 42, 0.6)' : '#ffffff',
                                    border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)'}`,
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    color: isDarkMode ? '#ffffff' : '#1f2937',
                                    fontFamily: "'Inter', sans-serif",
                                    lineHeight: '1.6',
                                    resize: 'vertical',
                                    marginBottom: '16px',
                                    outline: 'none'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = isDarkMode ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)'}
                            />
                            <button
                                type="submit"
                                disabled={!replyContent.trim() || submitting}
                                style={{
                                    padding: '12px 28px',
                                    background: (!replyContent.trim() || submitting)
                                        ? (isDarkMode ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.2)')
                                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    cursor: (!replyContent.trim() || submitting) ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: (!replyContent.trim() || submitting) ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.3)'
                                }}
                            >
                                {submitting ? 'Posting...' : 'Post Reply'}
                            </button>
                        </form>
                    </div>
                ) : !isAuthenticated ? (
                    <div style={{
                        background: isDarkMode ? 'rgba(30, 41, 59, 0.3)' : 'rgba(255, 255, 255, 0.5)',
                        borderRadius: '12px',
                        padding: '32px',
                        textAlign: 'center',
                        border: `1px solid ${isDarkMode ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.05)'}`
                    }}>
                        <p style={{
                            fontSize: '15px',
                            color: isDarkMode ? '#94a3b8' : '#64748b',
                            margin: '0 0 16px 0'
                        }}>
                            Please log in to join the discussion
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            style={{
                                padding: '10px 24px',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Log In
                        </button>
                    </div>
                ) : (
                    <div style={{
                        background: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                        borderRadius: '12px',
                        padding: '16px',
                        textAlign: 'center',
                        border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}>
                        <p style={{
                            fontSize: '14px',
                            color: '#ef4444',
                            margin: 0,
                            fontWeight: '600'
                        }}>
                            🔒 This thread is locked and cannot receive new replies
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

export default ThreadDetail;
