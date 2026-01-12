import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getIssueStats } from '../services/api';

function Home() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getIssueStats();
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Stats error:', error);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="hero">
        <div className="hero-content">
          <h1>AI-Powered Civic Issue Reporting</h1>
          <p>
            Report civic issues with just a photo. AI automatically classifies and prioritizes for faster resolution.
          </p>
          
          <div className="hero-buttons">
            <Link to="/report" className="btn btn-primary">
              Report an Issue
            </Link>
            <Link to="/dashboard" className="btn btn-secondary">
              View Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="section section-gray">
        <div className="container">
          <h2>Platform Statistics</h2>
          
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p style={{marginTop: '1rem', color: '#6b7280'}}>Loading...</p>
            </div>
          ) : stats ? (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{stats.total}</div>
                <div className="stat-label">Total Issues</div>
              </div>

              {stats.byStatus?.map((item) => (
                <div key={item._id} className="stat-card">
                  <div className="stat-number" style={{color: '#10b981'}}>{item.count}</div>
                  <div className="stat-label">{item._id.replace('_', ' ')}</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{textAlign: 'center', color: '#6b7280'}}>No data available</p>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="section section-white">
        <div className="container">
          <h2>How It Works</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📸</div>
              <h3>1. Take a Photo</h3>
              <p>Snap a picture of any civic issue - pothole, garbage, broken light, or water leakage.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>2. AI Classification</h3>
              <p>Our AI automatically identifies the issue type and assigns severity level.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h3>3. Track Progress</h3>
              <p>View all issues on an interactive dashboard and track resolution status.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="section hero">
        <div className="hero-content">
          <h2>Ready to Make Your City Better?</h2>
          <p>Join citizens making their neighborhoods cleaner and safer.</p>
          <Link to="/report" className="btn btn-primary">
            Report Your First Issue
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;