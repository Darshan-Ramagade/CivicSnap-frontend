import { useEffect, useState } from 'react';
import { getIssueStats } from '../services/api';

function StatisticsCard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await getIssueStats();
      setStats(response.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="section section-gray">
        <div className="container">
          <h2>Platform Statistics</h2>
          <div className="loading">
            <div className="spinner"></div>
            <p style={{marginTop: '1rem', color: '#6b7280'}}>Loading statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section section-gray">
        <div className="container">
          <h2>Platform Statistics</h2>
          <div className="empty-state">
            <p style={{color: '#ef4444'}}>{error}</p>
            <button onClick={fetchStats} className="link">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!stats || stats.total === 0) {
    return (
      <div className="section section-gray">
        <div className="container">
          <h2>Platform Statistics</h2>
          <div className="empty-state">
            <p>No issues reported yet</p>
            <a href="/report" className="link">Be the first to report!</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section section-gray">
      <div className="container">
        <h2>Platform Statistics</h2>
        
        <div className="stats-grid">
          {/* Total Issues */}
          <div className="stat-card">
            <div className="stat-number">{stats.total || 0}</div>
            <div className="stat-label">Total Issues</div>
          </div>

          {/* By Status */}
          {stats.byStatus && stats.byStatus.map((item) => (
            <div key={item._id} className="stat-card">
              <div 
                className="stat-number" 
                style={{
                  color: item._id === 'resolved' ? '#10b981' : 
                         item._id === 'in_progress' ? '#8b5cf6' : 
                         item._id === 'reported' ? '#3b82f6' :
                         '#6b7280'
                }}
              >
                {item.count}
              </div>
              <div className="stat-label">
                {item._id === 'in_progress' ? 'In Progress' : 
                 item._id.charAt(0).toUpperCase() + item._id.slice(1)}
              </div>
            </div>
          ))}

          {/* By Category (Top 3) */}
          {stats.byCategory && stats.byCategory.slice(0, 3).map((item) => (
            <div key={item._id} className="stat-card">
              <div className="stat-number" style={{color: '#f59e0b'}}>{item.count}</div>
              <div className="stat-label">
                {item._id.replace('_', ' ').charAt(0).toUpperCase() + 
                 item._id.replace('_', ' ').slice(1)}
              </div>
            </div>
          ))}
        </div>

        {/* AI Confidence */}
        {stats.averageAIConfidence !== undefined && (
          <div style={{marginTop: '2rem', textAlign: 'center'}}>
            <div style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#dbeafe',
              borderRadius: '8px'
            }}>
              <p style={{margin: 0, fontSize: '0.875rem', color: '#1e40af'}}>
                🤖 Average AI Confidence: <strong>{(stats.averageAIConfidence * 100).toFixed(1)}%</strong>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatisticsCard;