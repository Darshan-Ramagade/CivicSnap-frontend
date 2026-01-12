/**
 * Utility helper functions for the frontend
 */

// Format date to readable string
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('en-IN', options);
};

// Calculate time ago (e.g., "2 hours ago")
export const timeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }
  
  return 'Just now';
};

// Get color based on severity
export const getSeverityColor = (severity) => {
  const colors = {
    critical: 'bg-red-100 text-red-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    minor: 'bg-green-100 text-green-800'
  };
  return colors[severity] || colors.moderate;
};

// Get color based on status
export const getStatusColor = (status) => {
  const colors = {
    reported: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-purple-100 text-purple-800',
    resolved: 'bg-green-100 text-green-800',
    rejected: 'bg-gray-100 text-gray-800'
  };
  return colors[status] || colors.reported;
};

// Format category for display
export const formatCategory = (category) => {
  if (!category) return 'Unknown';
  
  const formatted = category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return formatted;
};

// Get icon emoji for category
export const getCategoryIcon = (category) => {
  const icons = {
    pothole: '🕳️',
    garbage: '🗑️',
    broken_light: '💡',
    water_leakage: '💧',
    graffiti: '🎨',
    other: '❓'
  };
  return icons[category] || icons.other;
};

// Validate image URL
export const isValidImageUrl = (url) => {
  try {
    new URL(url);
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  } catch {
    return false;
  }
};

// Validate coordinates
export const isValidCoordinates = (lat, lng) => {
  return (
    typeof lat === 'number' && 
    typeof lng === 'number' &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180
  );
};

// Get user's geolocation
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(new Error('Unable to get location'));
      }
    );
  });
};

// Format confidence percentage
export const formatConfidence = (confidence) => {
  if (confidence === undefined || confidence === null) return 'N/A';
  return `${(confidence * 100).toFixed(1)}%`;
};

// Format priority score with color
export const getPriorityColor = (priority) => {
  if (priority >= 80) return '#ef4444'; // red
  if (priority >= 60) return '#f59e0b'; // orange
  if (priority >= 40) return '#eab308'; // yellow
  return '#10b981'; // green
};

// Truncate text to specified length
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Convert status to readable format
export const formatStatus = (status) => {
  if (!status) return 'Unknown';
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

// Get severity emoji
export const getSeverityEmoji = (severity) => {
  const emojis = {
    critical: '🔴',
    moderate: '🟡',
    minor: '🟢'
  };
  return emojis[severity] || '⚪';
};

// Get status emoji
export const getStatusEmoji = (status) => {
  const emojis = {
    reported: '📋',
    in_progress: '⏳',
    resolved: '✅',
    rejected: '❌'
  };
  return emojis[status] || '❓';
};

// Calculate distance between two coordinates (in km)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance.toFixed(2);
};

// Format distance for display
export const formatDistance = (km) => {
  if (km < 1) {
    return `${(km * 1000).toFixed(0)} meters`;
  }
  return `${km} km`;
};

// Get relative time with more detail
export const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) !== 1 ? 's' : ''} ago`;
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) !== 1 ? 's' : ''} ago`;
};

// Group issues by category
export const groupByCategory = (issues) => {
  return issues.reduce((acc, issue) => {
    const category = issue.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(issue);
    return acc;
  }, {});
};

// Sort issues by priority
export const sortByPriority = (issues, order = 'desc') => {
  return [...issues].sort((a, b) => {
    const priorityA = a.priority || 0;
    const priorityB = b.priority || 0;
    return order === 'desc' ? priorityB - priorityA : priorityA - priorityB;
  });
};

// Filter issues by date range
export const filterByDateRange = (issues, startDate, endDate) => {
  return issues.filter(issue => {
    const issueDate = new Date(issue.createdAt);
    return issueDate >= startDate && issueDate <= endDate;
  });
};