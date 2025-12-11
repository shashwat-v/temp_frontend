import { useState, useEffect } from 'react';

const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('unknown'); // 'unknown', 'granted', 'denied', 'prompt'

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLoading(false);
      setPermissionStatus('denied');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString()
        };

        setLocation(newLocation);
        setPermissionStatus('granted');
        setLoading(false);

        // Store in localStorage for future visits
        localStorage.setItem('lastKnownLocation', JSON.stringify(newLocation));
      },
      (error) => {
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            setPermissionStatus('denied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            setPermissionStatus('denied');
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
          default:
            errorMessage = "An unknown error occurred while retrieving location";
            break;
        }
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Check for stored location and permission status on mount
  useEffect(() => {
    const storedLocation = localStorage.getItem('lastKnownLocation');
    if (storedLocation) {
      try {
        const parsed = JSON.parse(storedLocation);
        // Use stored location if it's less than 1 hour old
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        if (new Date(parsed.timestamp) > oneHourAgo) {
          setLocation(parsed);
        }
      } catch (e) {
        console.warn('Invalid stored location data');
      }
    }

    // Check permission status using Permissions API
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionStatus(result.state); // 'granted', 'denied', or 'prompt'

        // If already granted and no recent location, get it automatically
        if (result.state === 'granted' && !storedLocation) {
          getCurrentLocation();
        }

        // Listen for permission changes
        result.addEventListener('change', () => {
          setPermissionStatus(result.state);
        });
      }).catch(() => {
        // Permissions API not supported, fallback to checking on location request
        console.log('Permissions API not supported');
      });
    }
  }, []);

  return {
    location,
    loading,
    error,
    permissionStatus,
    getCurrentLocation,
    clearLocation: () => {
      setLocation(null);
      localStorage.removeItem('lastKnownLocation');
    }
  };
};

export default useGeolocation;