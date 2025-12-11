import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { issuesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import useGeolocation from '../hooks/useGeolocation';
import Navbar from '../components/Navbar';
import IssueForm from '../components/IssueForm';
import IssueListItem from '../components/IssueListItem';
import StatusMessage from '../components/StatusMessage';
import LocationPrompt from '../components/LocationPrompt';
import { FilterIcon, LocationIcon, PlusIcon } from '../components/Icons';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import '../styles/markercluster.css';
import 'leaflet.markercluster';
import 'leaflet.heat';

// Fix Leaflet default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Create a special icon for user location
let UserLocationIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6">
      <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="white" stroke-width="3"/>
      <circle cx="12" cy="12" r="4" fill="white"/>
    </svg>
  `),
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
});

// Create custom icons based on category and status
const getCustomIcon = (category, status) => {
  const colors = {
    open: '#ef4444',
    in_progress: '#3b82f6',
    resolved: '#10b981',
    closed: '#6b7280',
  };

  const icons = {
    pothole: '🕳️',
    garbage: '🗑️',
    streetlight: '💡',
    water: '💧',
    traffic: '🚦',
    other: '📍'
  };

  return L.divIcon({
    html: `
      <div style="
        background: ${colors[status] || '#ef4444'};
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      ">
        ${icons[category] || '📍'}
      </div>
    `,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

L.Marker.prototype.options.icon = DefaultIcon;

// Issue Popup Content Component
const IssuePopupContent = ({ issue, getStatusColor, onUpvote }) => {
  const { isAuthenticated } = useAuth();
  const [upvoting, setUpvoting] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(issue.upvote_count || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const handleUpvote = async () => {
    if (!isAuthenticated) {
      alert('Please login to upvote');
      return;
    }

    setUpvoting(true);
    try {
      if (hasUpvoted) {
        // Remove upvote
        await issuesAPI.removeUpvote(issue.id);
        setUpvoteCount(prev => prev - 1);
        setHasUpvoted(false);
      } else {
        // Add upvote
        await issuesAPI.upvoteIssue(issue.id);
        setUpvoteCount(prev => prev + 1);
        setHasUpvoted(true);
      }
      onUpvote(); // Refresh issues
    } catch (error) {
      console.error('Error upvoting:', error);
      if (error.response?.status === 409) {
        setHasUpvoted(true);
      }
    } finally {
      setUpvoting(false);
    }
  };

  return (
    <div className="issue-popup" style={{ fontFamily: 'Inter, sans-serif' }}>
      <h4 className="popup-title" style={{
        margin: '0 0 12px 0',
        fontSize: '18px',
        fontWeight: '700',
        color: '#1f2937'
      }}>
        {issue.title}
      </h4>

      <p className="popup-description" style={{
        margin: '0 0 12px 0',
        fontSize: '14px',
        color: '#6b7280',
        lineHeight: '1.6'
      }}>
        {issue.description}
      </p>

      {/* Image Display */}
      {issue.image_urls && issue.image_urls.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          {issue.image_urls.map((imageUrl, index) => {
            // Handle both absolute and relative URLs
            const imageSource = imageUrl.startsWith('http')
              ? imageUrl
              : `${process.env.REACT_APP_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'}${imageUrl}`;

            return (
              <img
                key={index}
                src={imageSource}
                alt={`Issue ${index + 1}`}
                style={{
                  width: '100%',
                  maxHeight: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  border: '1px solid #e5e7eb'
                }}
                onError={(e) => {
                  console.error('Failed to load image:', imageSource);
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+';
                }}
              />
            );
          })}
        </div>
      )}

      <div className="popup-meta" style={{
        background: 'rgba(102, 126, 234, 0.05)',
        padding: '12px',
        borderRadius: '8px',
        marginBottom: '12px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
          <span style={{ color: '#6b7280' }}>Category:</span>
          <span style={{ fontWeight: '600', color: '#1f2937', textTransform: 'capitalize' }}>
            {issue.category}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
          <span style={{ color: '#6b7280' }}>Status:</span>
          <span className={`badge badge-${issue.status}`} style={{
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'capitalize'
          }}>
            {issue.status.replace('_', ' ')}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span style={{ color: '#6b7280' }}>Reporter:</span>
          <span style={{ fontWeight: '600', color: '#1f2937' }}>
            {issue.user_name || 'Anonymous'}
          </span>
        </div>
      </div>

      {/* Upvote Button */}
      <button
        onClick={handleUpvote}
        disabled={upvoting || !isAuthenticated}
        className="btn btn-primary"
        style={{
          width: '100%',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: '600',
          opacity: (!isAuthenticated || upvoting) ? 0.6 : 1,
          cursor: (!isAuthenticated || upvoting) ? 'not-allowed' : 'pointer'
        }}
      >
        <span style={{ fontSize: '18px' }}>{hasUpvoted ? '💙' : '🤍'}</span>
        <span>{upvoting ? 'Loading...' : (hasUpvoted ? 'Upvoted' : 'Upvote')}</span>
        <span style={{
          padding: '2px 8px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '12px',
          fontSize: '12px'
        }}>
          {upvoteCount}
        </span>
      </button>

      {!isAuthenticated && (
        <div style={{
          marginTop: '8px',
          fontSize: '11px',
          color: '#9ca3af',
          textAlign: 'center'
        }}>
          Login to upvote and comment
        </div>
      )}
    </div>
  );
};

const MapView = () => {
  const { isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();
  const {
    location: userLocation,
    loading: locationLoading,
    error: locationError,
    permissionStatus,
    getCurrentLocation
  } = useGeolocation();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
  });

  // Dynamic center based on user location or default
  const [center, setCenter] = useState([
    parseFloat(process.env.REACT_APP_DEFAULT_CENTER_LAT) || 28.6139,
    parseFloat(process.env.REACT_APP_DEFAULT_CENTER_LNG) || 77.2090,
  ]);

  const [zoom] = useState(parseInt(process.env.REACT_APP_DEFAULT_ZOOM) || 13);
  const mapRef = useRef(null);

  // Heatmap and Clustering state
  const [showHeatmap, setShowHeatmap] = useState(false);
  // const [useClustering, setUseClustering] = useState(true);
  // const clusterGroupRef = useRef(null);
  const heatLayerRef = useRef(null);

  // State for issue creation
  const [isCreatingIssue, setIsCreatingIssue] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Status message state
  const [statusMessage, setStatusMessage] = useState(null);
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);

  // Update map center when user location is available
  useEffect(() => {
    if (userLocation && mapRef.current) {
      const map = mapRef.current;
      map.setView([userLocation.latitude, userLocation.longitude], 15, {
        animate: true,
        duration: 1.5
      });
      setCenter([userLocation.latitude, userLocation.longitude]);

      setStatusMessage({
        message: `Location found! Showing issues near you.`,
        type: 'success'
      });
    }
  }, [userLocation]);

  const fetchIssues = useCallback(async (bounds) => {
    try {
      setLoading(true);

      const params = {};

      if (filters.category) params.category = filters.category;
      if (filters.status) params.status = filters.status;

      if (bounds) {
        params.bounds = `${bounds.west},${bounds.south},${bounds.east},${bounds.north}`;
      }

      const response = await issuesAPI.getIssues(params);
      setIssues(response.data.data.issues || []);
    } catch (error) {
      console.error('Error fetching issues:', error);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  // Heatmap Layer Component
  function HeatmapLayer({ issues, show }) {
    const map = useMap();

    useEffect(() => {
      if (!map || !show || issues.length === 0) {
        if (heatLayerRef.current) {
          map.removeLayer(heatLayerRef.current);
          heatLayerRef.current = null;
        }
        return;
      }

      // Prepare heatmap data with weights
      const heatData = issues.map(issue => {
        // Weight by recency (more recent = higher weight)
        const daysOld = (Date.now() - new Date(issue.created_at)) / (1000 * 60 * 60 * 24);
        const recencyWeight = Math.max(1, 5 - daysOld / 7); // Decrease over weeks

        // Weight by status
        const statusWeights = {
          open: 2,
          in_progress: 1.5,
          resolved: 0.5,
          closed: 0.3
        };
        const statusWeight = statusWeights[issue.status] || 1;

        return [
          issue.latitude,
          issue.longitude,
          recencyWeight * statusWeight
        ];
      });

      // Remove old heatmap if exists
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
      }

      // Create new heatmap
      heatLayerRef.current = L.heatLayer(heatData, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: {
          0.0: '#10b981', // Green (low activity)
          0.5: '#f59e0b', // Yellow (moderate activity)
          1.0: '#ef4444'  // Red (high activity / problem zones)
        }
      });

      map.addLayer(heatLayerRef.current);

      return () => {
        if (heatLayerRef.current) {
          map.removeLayer(heatLayerRef.current);
          heatLayerRef.current = null;
        }
      };
    }, [map, show, issues]);

    return null;
  }

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        if (isCreatingIssue) {
          setSelectedPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
          setShowForm(true);
          setIsCreatingIssue(false);
          setStatusMessage(null);
        }
      },
      moveend: (e) => {
        const map = e.target;
        const bounds = map.getBounds();
        fetchIssues({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        });
      },
    });
    return null;
  }

  const handleReportClick = () => {
    if (!isAuthenticated) {
      setStatusMessage({
        message: 'Please login to report an issue',
        type: 'warning'
      });
      return;
    }

    setIsCreatingIssue(true);
    setStatusMessage({
      message: 'Click on the map to select the location of the issue',
      type: 'info'
    });
  };

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
    // Center map on clicked issue
    if (mapRef.current) {
      mapRef.current.setView([issue.latitude, issue.longitude], 16);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedPosition(null);
    setIsCreatingIssue(false);
    setStatusMessage(null);
  };

  const handleIssueCreated = () => {
    fetchIssues();
    setStatusMessage({
      message: 'Issue reported successfully!',
      type: 'success'
    });
  };

  const handleLocationRequest = () => {
    getCurrentLocation();
  };

  const getStatusColor = (status) => {
    const colors = {
      open: '#ef4444',
      in_progress: '#3b82f6',
      resolved: '#10b981',
      closed: '#6b7280',
    };
    return colors[status] || colors.open;
  };

  return (
    <div className="map-view">
      <Navbar />

      {/* Status Messages */}
      {statusMessage && (
        <StatusMessage
          message={statusMessage.message}
          type={statusMessage.type}
          onClose={() => setStatusMessage(null)}
        />
      )}

      <div style={{ display: 'flex', height: 'calc(100vh - 72px)' }}>
        {/* Enhanced Sidebar */}
        <div style={{
          width: '380px',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 250, 251, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(102, 126, 234, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '4px 0 24px -8px rgba(102, 126, 234, 0.08)'
        }}>
          {/* Location Status in Sidebar */}
          {userLocation && (
            <div style={{
              padding: '16px 24px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(59, 130, 246, 0.06) 100%)',
              borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
              fontSize: '13px',
              animation: 'slideDown 0.4s ease-out'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                }}>
                  <LocationIcon size={18} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#667eea', fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Your Location
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '11px', marginTop: '2px', fontFamily: 'monospace' }}>
                    {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                  </div>
                </div>
              </div>
              <div style={{
                color: '#6b7280',
                fontSize: '11px',
                marginLeft: '42px',
                padding: '4px 8px',
                background: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '6px',
                display: 'inline-block'
              }}>
                Accuracy: ±{Math.round(userLocation.accuracy)}m
              </div>
            </div>
          )}

          {/* Filters Section */}
          <div style={{
            padding: '24px',
            borderBottom: '1px solid rgba(102, 126, 234, 0.08)',
            background: 'transparent'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.08) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FilterIcon size={18} color="#667eea" />
              </div>
              <h3 style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '800',
                fontFamily: "'Outfit', sans-serif",
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em'
              }}>
                Filters
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#4b5563',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px'
                }}>
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: "'Inter', sans-serif",
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">All Categories</option>
                  <option value="pothole">Pothole</option>
                  <option value="garbage">Garbage</option>
                  <option value="streetlight">Streetlight</option>
                  <option value="water">Water</option>
                  <option value="traffic">Traffic</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#4b5563',
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px'
                }}>
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '600',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: "'Inter', sans-serif",
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleReportClick}
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '14px 20px',
                background: isCreatingIssue
                  ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '14px',
                fontSize: '15px',
                fontWeight: '700',
                fontFamily: "'Inter', sans-serif",
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: isCreatingIssue
                  ? '0 8px 20px rgba(245, 158, 11, 0.35)'
                  : '0 8px 20px rgba(102, 126, 234, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px) scale(1.02)';
                e.target.style.boxShadow = isCreatingIssue
                  ? '0 12px 32px rgba(245, 158, 11, 0.45)'
                  : '0 12px 32px rgba(102, 126, 234, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = isCreatingIssue
                  ? '0 8px 20px rgba(245, 158, 11, 0.35)'
                  : '0 8px 20px rgba(102, 126, 234, 0.35)';
              }}
            >
              {isCreatingIssue ? (
                <>
                  <LocationIcon size={18} color="white" />
                  <span>Click on Map to Pin Location</span>
                </>
              ) : (
                <>
                  <PlusIcon size={18} color="white" />
                  <span>Report New Issue</span>
                </>
              )}
            </button>

            {!userLocation && permissionStatus !== 'granted' && (
              <button
                onClick={handleLocationRequest}
                disabled={locationLoading}
                style={{
                  width: '100%',
                  marginTop: '12px',
                  padding: '12px 18px',
                  background: locationLoading ? '#9ca3af' : 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  fontFamily: "'Inter', sans-serif",
                  cursor: locationLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: locationLoading ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!locationLoading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!locationLoading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                  }
                }}
              >
                <LocationIcon size={16} color="white" />
                <span>{locationLoading ? 'Finding Your Location...' : 'Find My Location'}</span>
              </button>
            )}

            {/* Heatmap Toggle Button */}
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '12px 18px',
                background: showHeatmap
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: "'Inter', sans-serif",
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: showHeatmap
                  ? '0 4px 12px rgba(239, 68, 68, 0.3)'
                  : '0 4px 12px rgba(16, 185, 129, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px) scale(1.02)';
                e.target.style.boxShadow = showHeatmap
                  ? '0 8px 20px rgba(239, 68, 68, 0.4)'
                  : '0 8px 20px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = showHeatmap
                  ? '0 4px 12px rgba(239, 68, 68, 0.3)'
                  : '0 4px 12px rgba(16, 185, 129, 0.3)';
              }}
            >
              <span style={{ fontSize: '16px' }}>{showHeatmap ? '🔥' : '📊'}</span>
              <span>{showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}</span>
            </button>
          </div>

          {/* Issues List */}
          <div style={{
            padding: '20px 24px 16px 24px',
            borderBottom: '1px solid rgba(102, 126, 234, 0.08)',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.04) 0%, rgba(118, 75, 162, 0.02) 100%)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h4 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '800',
                fontFamily: "'Outfit', sans-serif",
                color: '#1f2937',
                letterSpacing: '-0.01em'
              }}>
                Issues Found
              </h4>
              <span style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '700',
                fontFamily: "'Inter', sans-serif",
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
                minWidth: '45px',
                textAlign: 'center'
              }}>
                {issues.length}
              </span>
            </div>
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 24px 24px 24px',
            background: 'transparent'
          }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      height: '80px',
                      background: 'linear-gradient(90deg, rgba(102, 126,234, 0.05) 0%, rgba(118, 75, 162, 0.03) 50%, rgba(102, 126, 234, 0.05) 100%)',
                      backgroundSize: '200% 100%',
                      borderRadius: '12px',
                      animation: 'shimmer 2s infinite'
                    }}
                  />
                ))}
              </div>
            ) : issues.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: '#9ca3af'
              }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: '16px',
                  opacity: 0.5
                }}>🗺️</div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#6b7280'
                }}>
                  No Issues Found
                </div>
                <div style={{ fontSize: '13px', color: '#9ca3af' }}>
                  Try adjusting your filters or move the map
                </div>
              </div>
            ) : (
              issues.map((issue) => (
                <IssueListItem
                  key={issue.id}
                  issue={issue}
                  onClick={handleIssueClick}
                  isSelected={selectedIssue?.id === issue.id}
                />
              ))
            )}
          </div>
        </div>

        {/* Map Container */}
        <div style={{ flex: 1, position: 'relative' }}>
          {/* Location Permission Prompt */}
          {showLocationPrompt && (
            <LocationPrompt
              location={userLocation}
              loading={locationLoading}
              error={locationError}
              permissionStatus={permissionStatus}
              onRequestLocation={handleLocationRequest}
              onDismiss={() => setShowLocationPrompt(false)}
            />
          )}

          <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            className={isCreatingIssue ? 'creating-issue' : ''}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url={isDarkMode
                ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              }
            />

            <HeatmapLayer issues={issues} show={showHeatmap} />
            <MapClickHandler />

            {/* User Location Marker */}
            {userLocation && (
              <Marker
                position={[userLocation.latitude, userLocation.longitude]}
                icon={UserLocationIcon}
              >
                <Popup>
                  <div style={{ textAlign: 'center' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#3b82f6' }}>Your Location</h4>
                    <p style={{ margin: '0', fontSize: '12px', color: '#6b7280' }}>
                      Accuracy: ~{Math.round(userLocation.accuracy)}m
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Issue Markers */}
            {issues.map((issue) => (
              <Marker
                key={issue.id}
                position={[issue.latitude, issue.longitude]}
                icon={getCustomIcon(issue.category, issue.status)}
              >
                <Popup maxWidth={350} minWidth={280}>
                  <IssuePopupContent
                    issue={issue}
                    getStatusColor={getStatusColor}
                    onUpvote={fetchIssues}
                  />
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Issue Form Modal */}
      {showForm && selectedPosition && (
        <IssueForm
          position={selectedPosition}
          onClose={handleFormClose}
          onSuccess={handleIssueCreated}
        />
      )}
    </div>
  );
};

export default MapView;