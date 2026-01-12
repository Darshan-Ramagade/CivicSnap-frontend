import { useEffect, useState } from 'react';
import { getAllIssues } from '../services/api';
import { formatDate, getCategoryIcon, formatCategory } from '../utils/helpers';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    category: '',
    severity: '',
    status: ''
  });

  useEffect(() => {
    fetchIssues();
  }, [filter]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter.category) params.category = filter.category;
      if (filter.severity) params.severity = filter.severity;
      if (filter.status) params.status = filter.status;
      
      const response = await getAllIssues(params);
      setIssues(response.data);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="section section-gray" style={{minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem'}}>
      <div className="container">
        <h1 className="page-heading">Issue Dashboard</h1>

        {/* Filters */}
        <div className="filter-bar">
          <div className="filter-grid">
            <select
              value={filter.category}
              onChange={(e) => setFilter({...filter, category: e.target.value})}
              className="form-select"
            >
              <option value="">All Categories</option>
              <option value="pothole">Pothole</option>
              <option value="garbage">Garbage</option>
              <option value="broken_light">Broken Light</option>
              <option value="water_leakage">Water Leakage</option>
              <option value="graffiti">Graffiti</option>
            </select>

            <select
              value={filter.severity}
              onChange={(e) => setFilter({...filter, severity: e.target.value})}
              className="form-select"
            >
              <option value="">All Severities</option>
              <option value="critical">Critical</option>
              <option value="moderate">Moderate</option>
              <option value="minor">Minor</option>
            </select>

            <select
              value={filter.status}
              onChange={(e) => setFilter({...filter, status: e.target.value})}
              className="form-select"
            >
              <option value="">All Statuses</option>
              <option value="reported">Reported</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Issues Grid */}
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p style={{marginTop: '1rem', color: '#6b7280'}}>Loading issues...</p>
          </div>
        ) : issues.length === 0 ? (
          <div className="empty-state">
            <p>No issues found</p>
            <Link to="/report" className="link">Report the first issue</Link>
          </div>
        ) : (
          <div className="issues-grid">
            {issues.map((issue) => (
              <div key={issue._id} className="issue-card">
                <img src={issue.imageUrl} alt={issue.category} />

                <div className="issue-card-content">
                  <div className="issue-card-header">
                    <span className="issue-icon">{getCategoryIcon(issue.category)}</span>
                    <span className={`badge ${getSeverityClass(issue.severity)}`}>
                      {issue.severity}
                    </span>
                  </div>

                  <h3>{formatCategory(issue.category)}</h3>
                  
                  <p className="issue-description">
                    {issue.description || 'No description'}
                  </p>

                  <div className="issue-meta">
                    <span>📍 {issue.location.city || 'Unknown'}</span>
                    <span>{formatDate(issue.createdAt)}</span>
                  </div>

                  <div className="issue-footer">
                    <span className={`badge ${getStatusClass(issue.status)}`}>
                      {issue.status.replace('_', ' ')}
                    </span>
                    <Link to={`/issues/${issue._id}`} className="link" style={{fontSize: '0.875rem'}}>
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;