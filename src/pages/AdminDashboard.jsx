import { useEffect, useState } from 'react';
import { getAllIssues, updateIssue, deleteIssue, getCurrentUser, isAdmin } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { formatDate, getCategoryIcon, formatCategory } from '../utils/helpers';

function AdminDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: 'reported' }); // Default: show new reports

  useEffect(() => {
    // Check if user is admin
    if (!isAdmin()) {
      showToast('Access denied. Admin only.', 'error');
      navigate('/login');
      return;
    }

    fetchIssues();
  }, [filter]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await getAllIssues(filter);
      setIssues(response.data);
    } catch (error) {
      showToast('Failed to load issues', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      await updateIssue(issueId, { status: newStatus });
      showToast(`Issue marked as ${newStatus.replace('_', ' ')}`, 'success');
      fetchIssues();
    } catch (error) {
      showToast('Failed to update status: ' + error.message, 'error');
    }
  };

  const handleDelete = async (issueId) => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return;

    try {
      await deleteIssue(issueId);
      showToast('Issue deleted successfully', 'success');
      fetchIssues();
    } catch (error) {
      showToast('Failed to delete: ' + error.message, 'error');
    }
  };

  const user = getCurrentUser();

  return (
    <div className="section section-gray" style={{minHeight: '100vh', paddingTop: '2rem'}}>
      <div className="container">
        
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 className="page-heading" style={{marginBottom: '0.5rem'}}>Admin Dashboard</h1>
            <p style={{color: '#6b7280'}}>Welcome, {user?.name}</p>
          </div>
          <Link to="/dashboard" className="btn" style={{backgroundColor: '#6b7280', color: 'white', padding: '0.5rem 1rem'}}>
            View Public Dashboard
          </Link>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <div className="filter-grid">
            <select
              value={filter.status || ''}
              onChange={(e) => setFilter({...filter, status: e.target.value})}
              className="form-select"
            >
              <option value="">All Statuses</option>
              <option value="reported">📋 Reported (New)</option>
              <option value="in_progress">⏳ In Progress</option>
              <option value="resolved">✅ Resolved</option>
              <option value="rejected">❌ Rejected</option>
            </select>

            <select
              value={filter.category || ''}
              onChange={(e) => setFilter({...filter, category: e.target.value})}
              className="form-select"
            >
              <option value="">All Categories</option>
              <option value="pothole">Pothole</option>
              <option value="garbage">Garbage</option>
              <option value="broken_light">Broken Light</option>
              <option value="water_leakage">Water Leakage</option>
            </select>

            <select
              value={filter.severity || ''}
              onChange={(e) => setFilter({...filter, severity: e.target.value})}
              className="form-select"
            >
              <option value="">All Severities</option>
              <option value="critical">Critical</option>
              <option value="moderate">Moderate</option>
              <option value="minor">Minor</option>
            </select>
          </div>
        </div>

        {/* Issues Table */}
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p style={{marginTop: '1rem'}}>Loading issues...</p>
          </div>
        ) : issues.length === 0 ? (
          <div className="empty-state">
            <p>No issues found with current filters</p>
          </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb'}}>
                  <th style={{padding: '1rem', textAlign: 'left', fontWeight: '600'}}>Issue</th>
                  <th style={{padding: '1rem', textAlign: 'left', fontWeight: '600'}}>Location</th>
                  <th style={{padding: '1rem', textAlign: 'left', fontWeight: '600'}}>Status</th>
                  <th style={{padding: '1rem', textAlign: 'left', fontWeight: '600'}}>Severity</th>
                  <th style={{padding: '1rem', textAlign: 'left', fontWeight: '600'}}>Reported</th>
                  <th style={{padding: '1rem', textAlign: 'center', fontWeight: '600'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue._id} style={{borderBottom: '1px solid #e5e7eb'}}>
                    <td style={{padding: '1rem'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                        <span style={{fontSize: '1.5rem'}}>{getCategoryIcon(issue.category)}</span>
                        <div>
                          <div style={{fontWeight: '600'}}>{formatCategory(issue.category)}</div>
                          <div style={{fontSize: '0.875rem', color: '#6b7280'}}>
                            {issue.description ? issue.description.substring(0, 50) + '...' : 'No description'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{padding: '1rem', fontSize: '0.875rem'}}>
                      {issue.location.city || 'Unknown'}
                    </td>
                    <td style={{padding: '1rem'}}>
                      <select
                        value={issue.status}
                        onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          border: '1px solid #d1d5db',
                          fontSize: '0.875rem'
                        }}
                      >
                        <option value="reported">Reported</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td style={{padding: '1rem'}}>
                      <span className={`badge badge-${issue.severity}`}>
                        {issue.severity}
                      </span>
                    </td>
                    <td style={{padding: '1rem', fontSize: '0.875rem', color: '#6b7280'}}>
                      {formatDate(issue.createdAt)}
                    </td>
                    <td style={{padding: '1rem', textAlign: 'center'}}>
                      <div style={{display: 'flex', gap: '0.5rem', justifyContent: 'center'}}>
                        <Link
                          to={`/issues/${issue._id}`}
                          className="btn"
                          style={{
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            padding: '0.375rem 0.75rem',
                            fontSize: '0.875rem'
                          }}
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(issue._id)}
                          className="btn"
                          style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            padding: '0.375rem 0.75rem',
                            fontSize: '0.875rem'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;