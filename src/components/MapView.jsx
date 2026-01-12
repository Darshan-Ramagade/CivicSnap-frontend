import { useEffect, useState } from 'react';
import { getCategoryIcon } from '../utils/helpers';

function MapView({ issues }) {
  const [selectedIssue, setSelectedIssue] = useState(null);

  // Center map on average of all issue coordinates
  const getMapCenter = () => {
    if (issues.length === 0) {
      return { lat: 28.7041, lng: 77.1025 }; // Default: New Delhi
    }

    const avgLat = issues.reduce((sum, issue) => 
      sum + issue.location.coordinates[1], 0) / issues.length;
    const avgLng = issues.reduce((sum, issue) => 
      sum + issue.location.coordinates[0], 0) / issues.length;

    return { lat: avgLat, lng: avgLng };
  };

  const center = getMapCenter();

  return (
    <div className="map-view">
      {/* Placeholder for map - In production, use Google Maps or Leaflet */}
      <div style={{
        width: '100%',
        height: '500px',
        backgroundColor: '#e5e7eb',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Map Header */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          right: '1rem',
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          zIndex: 10
        }}>
          <h3 style={{margin: 0, fontSize: '1rem'}}>
            📍 {issues.length} Issues Mapped
          </h3>
          <p style={{
            margin: '0.25rem 0 0 0', 
            fontSize: '0.875rem', 
            color: '#6b7280'
          }}>
            Center: {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
          </p>
        </div>

        {/* Simulated Map Markers */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(180deg, #a5b4fc 0%, #c7d2fe 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          
          {/* Issue Markers */}
          {issues.slice(0, 10).map((issue, index) => (
            <div
              key={issue._id}
              onClick={() => setSelectedIssue(issue)}
              style={{
                position: 'absolute',
                left: `${20 + (index % 5) * 15}%`,
                top: `${30 + Math.floor(index / 5) * 20}%`,
                fontSize: '2rem',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                filter: selectedIssue?._id === issue._id ? 'drop-shadow(0 0 10px rgba(37, 99, 235, 0.8))' : 'none',
                transform: selectedIssue?._id === issue._id ? 'scale(1.3)' : 'scale(1)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = selectedIssue?._id === issue._id ? 'scale(1.3)' : 'scale(1)'}
              title={issue.category}
            >
              {getCategoryIcon(issue.category)}
            </div>
          ))}

          {/* Map Integration Message */}
          <div style={{
            textAlign: 'center',
            color: '#4b5563',
            position: 'absolute',
            bottom: '2rem'
          }}>
            <p style={{fontSize: '0.875rem', margin: 0}}>
              🗺️ Map View (Placeholder)
            </p>
            <p style={{fontSize: '0.75rem', color: '#9ca3af', margin: '0.25rem 0 0 0'}}>
              Integrate Google Maps or Leaflet for interactive map
            </p>
          </div>
        </div>

        {/* Selected Issue Popup */}
        {selectedIssue && (
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'white',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            minWidth: '300px',
            maxWidth: '400px',
            zIndex: 20
          }}>
            <button
              onClick={() => setSelectedIssue(null)}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#9ca3af'
              }}
            >
              ×
            </button>

            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem'}}>
              <span style={{fontSize: '1.5rem'}}>{getCategoryIcon(selectedIssue.category)}</span>
              <h4 style={{margin: 0, fontSize: '1rem'}}>
                {selectedIssue.category.replace('_', ' ').toUpperCase()}
              </h4>
            </div>

            <p style={{
              fontSize: '0.875rem', 
              color: '#6b7280', 
              margin: '0.5rem 0',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {selectedIssue.description || 'No description'}
            </p>

            <div style={{fontSize: '0.75rem', color: '#9ca3af'}}>
              <p style={{margin: '0.25rem 0'}}>
                📍 {selectedIssue.location.city || 'Unknown'}
              </p>
              <p style={{margin: '0.25rem 0'}}>
                🔴 {selectedIssue.severity}
              </p>
            </div>

            <a 
              href={`/issues/${selectedIssue._id}`}
              className="link"
              style={{
                display: 'inline-block',
                marginTop: '0.75rem',
                fontSize: '0.875rem'
              }}
            >
              View Details →
            </a>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div style={{
        marginTop: '1rem',
        padding: '1rem',
        backgroundColor: '#fef3c7',
        borderRadius: '8px',
        fontSize: '0.875rem'
      }}>
        <p style={{margin: 0}}>
          <strong>💡 Note:</strong> This is a placeholder map view. 
          To implement a real interactive map, integrate:
        </p>
        <ul style={{margin: '0.5rem 0 0 1.5rem', paddingLeft: 0}}>
          <li><strong>Google Maps API</strong> - Best for detailed maps</li>
          <li><strong>Leaflet.js</strong> - Open source, free alternative</li>
          <li><strong>Mapbox</strong> - Customizable, modern design</li>
        </ul>
      </div>
    </div>
  );
}

export default MapView;