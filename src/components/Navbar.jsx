import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout, isAdmin } from '../services/api';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  const isActive = (path) => location.pathname === path;
  
  const handleLogout = () => {
    logout();
    navigate('/');
    window.location.reload(); // Refresh to clear state
  };
  
  return (
    <nav>
      <div className="container">
        <Link to="/" className="logo">
          <span className="icon">🏙️</span>
          <span className="text">CivicSnap</span>
        </Link>
        
        <div className="nav-links">
          <Link to="/" className={isActive('/') ? 'active' : ''}>
            Home
          </Link>
          <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
            Dashboard
          </Link>
          <Link to="/report" className={isActive('/report') ? 'active' : ''}>
            Report Issue
          </Link>
          
          {user ? (
            <>
              {isAdmin() && (
                <Link 
                  to="/admin/dashboard" 
                  className={isActive('/admin/dashboard') ? 'active' : ''}
                  style={{
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    fontWeight: '600'
                  }}
                >
                  Admin Panel
                </Link>
              )}
              <button 
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: '1px solid #d1d5db',
                  color: '#4b5563',
                  cursor: 'pointer',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  fontSize: 'inherit',
                  fontWeight: '500'
                }}
              >
                Logout ({user.name})
              </button>
            </>
          ) : (
            <Link to="/login" className={isActive('/login') ? 'active' : ''}>
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;