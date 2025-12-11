import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="badge-icon">🏙️</span>
                        <span className="badge-text">Empowering Communities</span>
                    </div>

                    <h1 className="hero-title">
                        Report. Track. Resolve.
                        <span className="hero-gradient">Make Your City Better</span>
                    </h1>

                    <p className="hero-description">
                        A crowdsourced platform connecting citizens with local authorities
                        to report and resolve public infrastructure issues. Your voice matters.
                    </p>

                    <div className="hero-cta">
                        {isAuthenticated ? (
                            <Link to="/map" className="btn btn-primary btn-large">
                                <span>View Live Map</span>
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                        ) : (
                            <>
                                <Link to="/signup" className="btn btn-primary btn-large">
                                    Get Started Free
                                </Link>
                                <Link to="/login" className="btn btn-secondary btn-large">
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="hero-stats">
                        <div className="stat">
                            <div className="stat-value">1,234</div>
                            <div className="stat-label">Issues Resolved</div>
                        </div>
                        <div className="stat">
                            <div className="stat-value">5,678</div>
                            <div className="stat-label">Active Citizens</div>
                        </div>
                        <div className="stat">
                            <div className="stat-value">89%</div>
                            <div className="stat-label">Response Rate</div>
                        </div>
                    </div>
                </div>

                <div className="hero-image">
                    <div className="floating-card card-1">
                        <div className="card-icon">🕳️</div>
                        <div className="card-content">
                            <div className="card-title">Pothole Reported</div>
                            <div className="card-status status-open">Open</div>
                        </div>
                    </div>

                    <div className="floating-card card-2">
                        <div className="card-icon">💡</div>
                        <div className="card-content">
                            <div className="card-title">Streetlight Fixed</div>
                            <div className="card-status status-resolved">Resolved</div>
                        </div>
                    </div>

                    <div className="floating-card card-3">
                        <div className="card-icon">🗑️</div>
                        <div className="card-content">
                            <div className="card-title">Garbage Collection</div>
                            <div className="card-status status-progress">In Progress</div>
                        </div>
                    </div>

                    <div className="hero-map-illustration">
                        <div className="map-marker marker-1"></div>
                        <div className="map-marker marker-2"></div>
                        <div className="map-marker marker-3"></div>
                        <div className="map-marker marker-4"></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="section-header">
                    <h2 className="section-title">How It Works</h2>
                    <p className="section-subtitle">
                        Three simple steps to make a real impact in your community
                    </p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon report">
                            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                        </div>
                        <h3 className="feature-title">Report Issues</h3>
                        <p className="feature-description">
                            Spotted a pothole? Broken streetlight? Report it instantly with
                            location, photos, and description.
                        </p>
                        <div className="feature-link">
                            <span>Learn more</span>
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon track">
                            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                        </div>
                        <h3 className="feature-title">Track Progress</h3>
                        <p className="feature-description">
                            Monitor your reports in real-time. Get updates when authorities
                            respond or resolve the issue.
                        </p>
                        <div className="feature-link">
                            <span>Learn more</span>
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon engage">
                            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <h3 className="feature-title">Engage Community</h3>
                        <p className="feature-description">
                            Upvote issues that affect you. Join discussions in the community
                            forum. Collaborate for solutions.
                        </p>
                        <div className="feature-link">
                            <span>Learn more</span>
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="categories">
                <div className="section-header">
                    <h2 className="section-title">Report Any Issue</h2>
                    <p className="section-subtitle">
                        From potholes to broken lights, we've got you covered
                    </p>
                </div>

                <div className="categories-grid">
                    <div className="category-card">
                        <div className="category-icon">🕳️</div>
                        <div className="category-name">Potholes</div>
                    </div>
                    <div className="category-card">
                        <div className="category-icon">🗑️</div>
                        <div className="category-name">Garbage</div>
                    </div>
                    <div className="category-card">
                        <div className="category-icon">💡</div>
                        <div className="category-name">Streetlights</div>
                    </div>
                    <div className="category-card">
                        <div className="category-icon">💧</div>
                        <div className="category-name">Water Issues</div>
                    </div>
                    <div className="category-card">
                        <div className="category-icon">🚦</div>
                        <div className="category-name">Traffic</div>
                    </div>
                    <div className="category-card">
                        <div className="category-icon">📍</div>
                        <div className="category-name">Other</div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2 className="cta-title">Ready to Make a Difference?</h2>
                    <p className="cta-description">
                        Join thousands of citizens working together to improve their communities
                    </p>
                    <div className="cta-buttons">
                        {!isAuthenticated && (
                            <Link to="/signup" className="btn btn-primary btn-large">
                                Create Free Account
                            </Link>
                        )}
                        <Link to="/map" className="btn btn-outline btn-large">
                            Explore the Map
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h3>CivicMap</h3>
                        <p>Empowering communities through transparency and collaboration</p>
                    </div>

                    <div className="footer-links">
                        <div className="footer-column">
                            <h4>Product</h4>
                            <Link to="/map">Live Map</Link>
                            <Link to="/forum">Community Forum</Link>
                            <Link to="/about">About Us</Link>
                        </div>

                        <div className="footer-column">
                            <h4>Resources</h4>
                            <a href="/api-docs">API Docs</a>
                            <a href="#help">Help Center</a>
                            <a href="#contact">Contact</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2025 CivicMap. Built for CS-3810 by Team Project Practices</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
