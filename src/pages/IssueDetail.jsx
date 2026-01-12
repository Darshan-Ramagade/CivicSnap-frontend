import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getIssueById, voteIssue, deleteIssue, updateIssue } from '../services/api';
import { useToast } from '../context/ToastContext';  // ← ADD THIS
import { 
  formatDate, 
  timeAgo, 
  getCategoryIcon, 
  formatCategory, 
  formatConfidence 
} from '../utils/helpers';

function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();  // ← ADD THIS
  
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const fetchIssue = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getIssueById(id);
      setIssue(response.data);
    } catch (err) {
      setError('Failed to load issue details');
      console.error('Error fetching issue:', err);
      showToast('Failed to load issue details', 'error');  // ← REPLACE alert()
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    try {
      setActionLoading(true);
      await voteIssue(id);
      await fetchIssue();
      showToast('Vote recorded successfully! 👍', 'success');  // ← REPLACE alert()
    } catch (err) {
      showToast('Failed to vote: ' + err.message, 'error');  // ← REPLACE alert()
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setActionLoading(true);
      await updateIssue(id, { status: newStatus });
      await fetchIssue();
      
      // Different messages for different statuses
      const messages = {
        in_progress: 'Issue marked as In Progress ⏳',
        resolved: 'Issue marked as Resolved ✅',
        rejected: 'Issue marked as Rejected ❌'
      };
      
      showToast(messages[newStatus] || 'Status updated successfully', 'success');  // ← REPLACE alert()
    } catch (err) {
      showToast('Failed to update status: ' + err.message, 'error');  // ← REPLACE alert()
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      await deleteIssue(id);
      showToast('Issue deleted successfully', 'success');  // ← REPLACE alert()
      
      // Redirect after short delay to show toast
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      showToast('Failed to delete issue: ' + err.message, 'error');  // ← REPLACE alert()
      setActionLoading(false);
    }
  };

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

  // Loading state
  if (loading) {
    return (
      <div className="section section-gray" style={{minHeight: '100vh', paddingTop: '3rem'}}>
        <div className="container">
          <div className="loading">
            <div className="spinner"></div>
            <p style={{marginTop: '1rem', color: '#6b7280'}}>Loading issue details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !issue) {
    return (
      <div className="section section-gray" style={{minHeight: '100vh', paddingTop: '3rem'}}>
        <div className="container">
          <div className="empty-state">
            <p style={{fontSize: '3rem', marginBottom: '1rem'}}>❌</p>
            <p style={{fontSize: '1.25rem', marginBottom: '1rem'}}>{error || 'Issue not found'}</p>
            <Link to="/dashboard" className="btn btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="section section-gray" style={{minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem'}}>
      <div className="container" style={{maxWidth: '900px'}}>
        
        {/* Back Button */}
        <div style={{marginBottom: '1.5rem'}}>
          <Link to="/dashboard" className="link" style={{display: 'inline-flex', alignItems: 'center', gap: '0.5rem'}}>
            ← Back to Dashboard
          </Link>
        </div>

        {/* Main Card */}
        <div style={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden'}}>
          
          {/* Image */}
          <img 
            src={issue.imageUrl} 
            alt={issue.category}
            style={{width: '100%', height: '400px', objectFit: 'cover'}}
          />

          {/* Content */}
          <div style={{padding: '2rem'}}>
            
            {/* Header */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                <span style={{fontSize: '2.5rem'}}>{getCategoryIcon(issue.category)}</span>
                <div>
                  <h1 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem'}}>
                    {formatCategory(issue.category)}
                  </h1>
                  <p style={{color: '#6b7280', fontSize: '0.875rem'}}>
                    Reported {timeAgo(issue.createdAt)}
                  </p>
                </div>
              </div>
              
              <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end'}}>
                <span className={`badge ${getSeverityClass(issue.severity)}`}>
                  {issue.severity}
                </span>
                <span className={`badge ${getStatusClass(issue.status)}`}>
                  {issue.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Description */}
            {issue.description && (
              <div style={{marginBottom: '1.5rem'}}>
                <h3 style={{fontWeight: '600', marginBottom: '0.5rem'}}>Description</h3>
                <p style={{color: '#4b5563', lineHeight: '1.6'}}>{issue.description}</p>
              </div>
            )}

            {/* Location Details */}
            <div style={{marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '6px'}}>
              <h3 style={{fontWeight: '600', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                📍 Location
              </h3>
              <div style={{color: '#4b5563', fontSize: '0.875rem'}}>
                {issue.location.address && <p style={{marginBottom: '0.25rem'}}>{issue.location.address}</p>}
                <p style={{marginBottom: '0.25rem'}}>
                  {issue.location.city && `${issue.location.city}, `}
                  {issue.location.state && `${issue.location.state} `}
                  {issue.location.pincode && issue.location.pincode}
                </p>
                <p style={{color: '#9ca3af', fontSize: '0.75rem'}}>
                  Coordinates: {issue.location.coordinates[1].toFixed(4)}, {issue.location.coordinates[0].toFixed(4)}
                </p>
              </div>
            </div>

            {/* AI Analysis */}
            <div style={{marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#dbeafe', borderRadius: '6px'}}>
              <h3 style={{fontWeight: '600', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                🤖 AI Analysis
              </h3>
              <div style={{color: '#1e40af', fontSize: '0.875rem'}}>
                <p style={{marginBottom: '0.25rem'}}>
                  <strong>Classification:</strong> {formatCategory(issue.category)}
                </p>
                <p style={{marginBottom: '0.25rem'}}>
                  <strong>Confidence:</strong> {formatConfidence(issue.aiConfidence)}
                </p>
                <p style={{marginBottom: '0.25rem'}}>
                  <strong>Severity:</strong> {issue.severity}
                </p>
                <p style={{marginBottom: '0.25rem'}}>
                  <strong>Model:</strong> {issue.aiModel}
                </p>
              </div>
            </div>

            {/* Metadata Grid */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem'}}>
              
              {/* Priority */}
              <div>
                <p style={{fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem'}}>Priority</p>
                <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb'}}>{issue.priority}</p>
              </div>

              {/* Votes */}
              <div>
                <p style={{fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem'}}>Community Votes</p>
                <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981'}}>👍 {issue.votes}</p>
              </div>

              {/* Views */}
              <div>
                <p style={{fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem'}}>Views</p>
                <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6'}}>👁️ {issue.viewCount}</p>
              </div>

              {/* Reported Date */}
              <div>
                <p style={{fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem'}}>Reported On</p>
                <p style={{fontSize: '0.875rem', fontWeight: '600'}}>{formatDate(issue.createdAt)}</p>
              </div>
            </div>

            {/* Reporter Info (if available) */}
            {issue.reportedBy && (issue.reportedBy.name || issue.reportedBy.contact) && (
              <div style={{marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '6px'}}>
                <h3 style={{fontWeight: '600', marginBottom: '0.75rem'}}>Reported By</h3>
                <div style={{color: '#4b5563', fontSize: '0.875rem'}}>
                  {issue.reportedBy.name && <p><strong>Name:</strong> {issue.reportedBy.name}</p>}
                  {issue.reportedBy.contact && <p><strong>Contact:</strong> {issue.reportedBy.contact}</p>}
                </div>
              </div>
            )}

            {/* Resolved Info */}
            {issue.status === 'resolved' && issue.resolvedAt && (
              <div style={{marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#d1fae5', borderRadius: '6px', border: '1px solid #10b981'}}>
                <p style={{color: '#065f46', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  ✅ <strong>Resolved on {formatDate(issue.resolvedAt)}</strong>
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem'}}>
              <div style={{display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
                
                {/* Vote Button */}
                <button
                  onClick={handleVote}
                  disabled={actionLoading}
                  className="btn"
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    padding: '0.625rem 1.25rem',
                    fontSize: '0.875rem'
                  }}
                >
                  👍 Upvote ({issue.votes})
                </button>

                {/* Status Change Buttons */}
                {issue.status === 'reported' && (
                  <button
                    onClick={() => handleStatusChange('in_progress')}
                    disabled={actionLoading}
                    className="btn"
                    style={{
                      backgroundColor: '#8b5cf6',
                      color: 'white',
                      padding: '0.625rem 1.25rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    ⏳ Mark In Progress
                  </button>
                )}

                {issue.status === 'in_progress' && (
                  <button
                    onClick={() => handleStatusChange('resolved')}
                    disabled={actionLoading}
                    className="btn"
                    style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      padding: '0.625rem 1.25rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    ✅ Mark Resolved
                  </button>
                )}

                {/* Delete Button */}
                <button
                  onClick={handleDelete}
                  disabled={actionLoading}
                  className="btn"
                  style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    padding: '0.625rem 1.25rem',
                    fontSize: '0.875rem',
                    marginLeft: 'auto'
                  }}
                >
                  🗑️ Delete
                </button>
              </div>

              {actionLoading && (
                <div style={{marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.875rem'}}>
                  <div className="spinner" style={{width: '1rem', height: '1rem', borderWidth: '2px'}}></div>
                  Processing...
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default IssueDetail;