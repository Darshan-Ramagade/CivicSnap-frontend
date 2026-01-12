import { Link } from 'react-router-dom';
import { formatDate, getCategoryIcon, formatCategory } from '../utils/helpers';

function IssueCard({ issue }) {
  const getSeverityClass = (severity) => {
    if (severity === 'critical') return 'badge-critical';
    if (severity === 'moderate') return 'badge-moderate';
    return 'badge-minor';
  };

  const getStatusClass = (status) => {
    if (status === 'reported') return 'badge-reported';
    if (status === 'in_progress') return 'badge-in-progress';
    if (status === 'resolved') return 'badge-resolved';
    return 'badge-reported';
  };

  return (
    <div className="issue-card">
      <img 
        src={issue.imageUrl} 
        alt={issue.category}
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
        }}
      />

      <div className="issue-card-content">
        <div className="issue-card-header">
          <span className="issue-icon">{getCategoryIcon(issue.category)}</span>
          <span className={`badge ${getSeverityClass(issue.severity)}`}>
            {issue.severity}
          </span>
        </div>

        <h3>{formatCategory(issue.category)}</h3>
        
        <p className="issue-description">
          {issue.description || 'No description provided'}
        </p>

        <div className="issue-meta">
          <span>📍 {issue.location?.city || 'Unknown location'}</span>
          <span>{formatDate(issue.createdAt)}</span>
        </div>

        <div className="issue-footer">
          <span className={`badge ${getStatusClass(issue.status)}`}>
            {issue.status.replace('_', ' ')}
          </span>
          <Link 
            to={`/issues/${issue._id}`} 
            className="link" 
            style={{fontSize: '0.875rem'}}
          >
            View Details →
          </Link>
        </div>

        {/* Additional Info */}
        <div style={{
          marginTop: '0.75rem', 
          paddingTop: '0.75rem', 
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: '#6b7280'
        }}>
          <span>👍 {issue.votes || 0} votes</span>
          <span>👁️ {issue.viewCount || 0} views</span>
          <span>🎯 Priority: {issue.priority || 50}</span>
        </div>
      </div>
    </div>
  );
}

export default IssueCard;