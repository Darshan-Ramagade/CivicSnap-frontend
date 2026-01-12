import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { useToast } from '../context/ToastContext';

function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await login(formData);
      
      showToast('Login successful!', 'success');
      
      // Redirect based on role
      if (response.data.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      showToast(error.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section section-gray" style={{minHeight: '100vh', display: 'flex', alignItems: 'center'}}>
      <div className="container" style={{maxWidth: '450px'}}>
        
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          
          <div style={{textAlign: 'center', marginBottom: '2rem'}}>
            <h1 style={{fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem'}}>
              🏙️ CivicSnap
            </h1>
            <p style={{color: '#6b7280'}}>Login to continue</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="admin@civicmapper.com"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-submit"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#fef3c7',
            borderRadius: '6px',
            fontSize: '0.875rem'
          }}>
            <p style={{margin: '0 0 0.5rem 0'}}><strong>Test Credentials:</strong></p>
            <p style={{margin: 0}}>
              Admin: admin@civicmapper.com / admin123
            </p>
          </div>

          <div style={{marginTop: '1rem', textAlign: 'center'}}>
            <Link to="/" className="link" style={{fontSize: '0.875rem'}}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;