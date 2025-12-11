import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import {
  MapIcon,
  ChartIcon,
  BrainIcon,
  UsersIcon,
  InfoIcon,
  UserIcon,
  FileIcon,
  SettingsIcon,
  LogoutIcon,
  CityIcon,
  SunIcon,
  MoonIcon
} from './Icons';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setShowProfileDropdown(false);
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: scrolled
        ? 'rgba(255, 255, 255, 0.85)'
        : 'linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      borderBottom: scrolled
        ? '1px solid rgba(102, 126, 234, 0.2)'
        : '1px solid rgba(102, 126, 234, 0.08)',
      boxShadow: scrolled
        ? '0 8px 32px -8px rgba(102, 126, 234, 0.15), 0 0 0 1px rgba(102, 126, 234, 0.05), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)'
        : '0 4px 20px -4px rgba(102, 126, 234, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.9)',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      animation: 'slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
        position: 'relative',
      }}>
        {/* Decorative gradient orbs */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '10%',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          animation: 'float 6s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '15%',
          width: '180px',
          height: '180px',
          background: 'radial-gradient(circle, rgba(118, 75, 162, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          pointerEvents: 'none',
          animation: 'float 8s ease-in-out infinite reverse',
        }} />

        {/* Logo */}
        <div
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            position: 'relative',
            zIndex: 2,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
          }}
        >
          <div style={{
            filter: 'drop-shadow(0 4px 12px rgba(102, 126, 234, 0.25))',
            animation: 'float 3s ease-in-out infinite',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}>
            <CityIcon size={36} color="#667eea" />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle, rgba(102, 126, 234, 0.3) 0%, transparent 70%)',
              filter: 'blur(20px)',
              zIndex: -1,
            }} />
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '900',
            fontFamily: "'Outfit', sans-serif",
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
            backgroundSize: '200% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0,
            letterSpacing: '-0.03em',
            position: 'relative',
            animation: 'gradientShift 6s ease infinite',
          }}>
            CivicMap
            <div style={{
              position: 'absolute',
              bottom: '-4px',
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #667eea, #764ba2, transparent)',
              borderRadius: '3px',
              opacity: 0.6,
            }} />
          </h1>
        </div>

        {/* Navigation Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(10px)',
          padding: '6px',
          borderRadius: '16px',
          boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(102, 126, 234, 0.06)',
          border: '1px solid rgba(102, 126, 234, 0.08)',
        }}>
          <NavButton onClick={() => navigate('/map')} icon={<MapIcon />} label="Live Map" />
          <NavButton onClick={() => navigate('/analytics')} icon={<ChartIcon />} label="Analytics" />
          <NavButton onClick={() => navigate('/insights')} icon={<BrainIcon />} label="AI Insights" />
          <NavButton onClick={() => navigate('/community')} icon={<UsersIcon />} label="Community" />
          <NavButton onClick={() => navigate('/about')} icon={<InfoIcon />} label="About" />
        </div>

        {/* User Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2 }}>
          {/* Dark Mode Toggle - DISABLED (causes crashes) */}
          {/* <button onClick={toggleTheme}>...</button> */}

          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 18px',
                  border: '2px solid transparent',
                  borderRadius: '16px',
                  background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #667eea 0%, #764ba2 100%) border-box',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontFamily: "'Inter', sans-serif",
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.9)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
                }}
              >
                {/* Shine effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
                  animation: 'shine 3s infinite',
                }} />

                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '700',
                  fontSize: '17px',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4), inset 0 -2px 8px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                }}>
                  {user?.full_name?.[0] || user?.email?.[0] || 'U'}
                  <div style={{
                    position: 'absolute',
                    inset: '-2px',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    borderRadius: '50%',
                    zIndex: -1,
                    opacity: 0.3,
                    filter: 'blur(6px)',
                  }} />
                </div>
                <span style={{
                  color: '#374151',
                  fontWeight: '700',
                  maxWidth: '100px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: '15px',
                }}>
                  {user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User'}
                </span>
                <span style={{
                  color: '#9ca3af',
                  fontSize: '11px',
                  transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: showProfileDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                  fontWeight: '700',
                }}>▼</span>
              </button>

              {showProfileDropdown && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 12px)',
                  width: '260px',
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(24px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                  border: '1px solid rgba(102, 126, 234, 0.15)',
                  borderRadius: '20px',
                  boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(102, 126, 234, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                  zIndex: 1001,
                  animation: 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  overflow: 'hidden',
                }}>
                  {/* Gradient header */}
                  <div style={{
                    padding: '20px 24px',
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.08) 100%)',
                    borderBottom: '1px solid rgba(102, 126, 234, 0.12)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      width: '100px',
                      height: '100px',
                      background: 'radial-gradient(circle, rgba(118, 75, 162, 0.15) 0%, transparent 70%)',
                      filter: 'blur(20px)',
                    }} />
                    <p style={{
                      margin: 0,
                      fontWeight: '800',
                      fontSize: '16px',
                      color: '#1f2937',
                      position: 'relative',
                    }}>
                      {user?.full_name || 'User'}
                    </p>
                    <p style={{
                      margin: '6px 0 0 0',
                      color: '#6b7280',
                      fontSize: '13px',
                      fontWeight: '500',
                      position: 'relative',
                    }}>
                      {user?.email}
                    </p>
                  </div>

                  <div style={{ padding: '8px' }}>
                    <DropdownItem
                      icon={<UserIcon />}
                      label="My Profile"
                      onClick={() => { navigate('/profile'); setShowProfileDropdown(false); }}
                    />

                    <DropdownItem
                      icon={<FileIcon />}
                      label="My Issues"
                      onClick={() => { navigate('/my-issues'); setShowProfileDropdown(false); }}
                    />

                    <DropdownItem
                      icon={<SettingsIcon />}
                      label="Settings"
                      onClick={() => { navigate('/settings'); setShowProfileDropdown(false); }}
                    />

                    <div style={{
                      height: '1px',
                      background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.25), transparent)',
                      margin: '8px 12px',
                    }} />

                    <DropdownItem
                      icon={<LogoutIcon />}
                      label="Logout"
                      onClick={handleLogout}
                      danger={true}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => navigate('/register')}
                style={{
                  padding: '12px 24px',
                  border: '2px solid transparent',
                  borderRadius: '14px',
                  background: 'white',
                  backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box',
                  color: '#667eea',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontFamily: "'Inter', sans-serif",
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.12)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px) scale(1.02)';
                  e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.12)';
                }}
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate('/login')}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontFamily: "'Inter', sans-serif",
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  boxShadow: '0 4px 16px rgba(102, 126, 234, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-3px) scale(1.02)';
                  e.target.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                  e.target.style.background = 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                  e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                }}
              >
                <span style={{ position: 'relative', zIndex: 1 }}>Login</span>
                {/* Shine effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                  animation: 'shine 3s infinite',
                }} />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// NavButton Component with enhanced hover effects
const NavButton = ({ onClick, icon, label }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        padding: '10px 16px',
        background: isHovered
          ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.12) 100%)'
          : 'transparent',
        border: 'none',
        borderRadius: '12px',
        color: isHovered ? '#667eea' : '#4b5563',
        fontWeight: '700',
        cursor: 'pointer',
        fontSize: '14px',
        fontFamily: "'Inter', sans-serif",
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: isHovered ? 'translateY(-2px) scale(1.05)' : 'translateY(0) scale(1)',
        boxShadow: isHovered
          ? '0 4px 12px rgba(102, 126, 234, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
          : 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated gradient underline */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: `translateX(-50%) scaleX(${isHovered ? 1 : 0})`,
        width: '80%',
        height: '2px',
        background: 'linear-gradient(90deg, #667eea, #764ba2)',
        borderRadius: '2px',
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }} />

      <span style={{
        transform: isHovered ? 'scale(1.15)' : 'scale(1)',
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        display: 'inline-flex',
        alignItems: 'center',
      }}>{icon}</span>
      <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
    </button>
  );
};

// DropdownItem Component with enhanced effects
const DropdownItem = ({ icon, label, onClick, danger = false }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '100%',
        padding: '14px 16px',
        border: 'none',
        borderRadius: '12px',
        background: isHovered
          ? (danger
            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(220, 38, 38, 0.08) 100%)'
            : 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.08) 100%)')
          : 'transparent',
        textAlign: 'left',
        cursor: 'pointer',
        fontSize: '14px',
        fontFamily: "'Inter', sans-serif",
        fontWeight: '600',
        color: danger ? (isHovered ? '#ef4444' : '#6b7280') : (isHovered ? '#667eea' : '#4b5563'),
        transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
        boxShadow: isHovered
          ? (danger
            ? '0 2px 8px rgba(239, 68, 68, 0.15)'
            : '0 2px 8px rgba(102, 126, 234, 0.12)')
          : 'none',
      }}
    >
      <span style={{
        transform: isHovered ? 'scale(1.2) rotate(5deg)' : 'scale(1) rotate(0deg)',
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        display: 'inline-flex',
        alignItems: 'center',
      }}>{icon}</span>
      <span>{label}</span>
    </button>
  );
};

export default Navbar;