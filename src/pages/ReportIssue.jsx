import { useState } from 'react';
import { createIssue } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import ImageUpload from '../components/ImageUpload';  // ← ADD THIS

function ReportIssue() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    imageUrl: '',
    description: '',
    location: {
      latitude: '',
      longitude: '',
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    reportedBy: {
      name: '',
      contact: ''
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiResult, setAiResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        location: { ...formData.location, [field]: value }
      });
    } else if (name.startsWith('reportedBy.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        reportedBy: { ...formData.reportedBy, [field]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageUploaded = (imageUrl) => {
    setFormData({ ...formData, imageUrl });
    setError('');
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            location: {
              ...formData.location,
              latitude: position.coords.latitude.toString(),
              longitude: position.coords.longitude.toString()
            }
          });
          showToast('Location captured successfully', 'success');
        },
        (error) => {
          showToast('Unable to get location: ' + error.message, 'error');
        }
      );
    } else {
      showToast('Geolocation is not supported by your browser', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.imageUrl) {
      setError('Please upload an image first');
      return;
    }
    
    setLoading(true);
    setError('');
    setAiResult(null);

    try {
      const issueData = {
        imageUrl: formData.imageUrl,
        description: formData.description,
        location: {
          latitude: parseFloat(formData.location.latitude),
          longitude: parseFloat(formData.location.longitude),
          address: formData.location.address,
          city: formData.location.city,
          state: formData.location.state,
          pincode: formData.location.pincode
        },
        reportedBy: formData.reportedBy
      };

      const response = await createIssue(issueData);
      setAiResult(response.aiAnalysis);
      showToast('Issue reported successfully!', 'success');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);

    } catch (err) {
      setError(err.message || 'Failed to submit issue');
      showToast(err.message || 'Failed to submit issue', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (aiResult) {
    return (
      <div className="section section-gray" style={{minHeight: '100vh', paddingTop: '3rem'}}>
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h2>Issue Reported Successfully!</h2>
          
          <div className="ai-result">
            <h3>AI Analysis Results:</h3>
            <div className="ai-result-content">
              <p><strong>Category:</strong> {aiResult.category}</p>
              <p><strong>Severity:</strong> {aiResult.severity}</p>
              <p><strong>Confidence:</strong> {(aiResult.confidence * 100).toFixed(1)}%</p>
            </div>
          </div>

          <p style={{color: '#6b7280', marginTop: '1.5rem'}}>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  // Form screen
  return (
    <div className="section section-gray" style={{minHeight: '100vh'}}>
      <div className="container">
        <h1 className="page-heading">Report Civic Issue</h1>

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            
            {/* Image Upload Component */}
            <ImageUpload 
              onImageUploaded={handleImageUploaded}
              error={error}
            />

            {/* Description */}
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe the civic issue in detail..."
                className="form-textarea"
              />
            </div>

            {/* Location */}
            <div className="form-group">
              <div style={{
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '0.5rem'
              }}>
                <label className="form-label" style={{marginBottom: 0}}>
                  Location *
                </label>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="link"
                  style={{fontSize: '0.875rem'}}
                >
                  📍 Use Current Location
                </button>
              </div>
              
              <div className="form-row">
                <input
                  type="number"
                  step="any"
                  name="location.latitude"
                  value={formData.location.latitude}
                  onChange={handleChange}
                  required
                  placeholder="Latitude"
                  className="form-input"
                />
                <input
                  type="number"
                  step="any"
                  name="location.longitude"
                  value={formData.location.longitude}
                  onChange={handleChange}
                  required
                  placeholder="Longitude"
                  className="form-input"
                />
              </div>

              <input
                type="text"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                placeholder="Street Address"
                className="form-input"
                style={{marginTop: '0.5rem'}}
              />

              <div className="form-row" style={{marginTop: '0.5rem'}}>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="form-input"
                />
                <input
                  type="text"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  placeholder="State"
                  className="form-input"
                />
                <input
                  type="text"
                  name="location.pincode"
                  value={formData.location.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  className="form-input"
                />
              </div>
            </div>

            {/* Reporter Info */}
            <div className="form-group">
              <label className="form-label">Your Information (Optional)</label>
              <div className="form-row">
                <input
                  type="text"
                  name="reportedBy.name"
                  value={formData.reportedBy.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="form-input"
                />
                <input
                  type="tel"
                  name="reportedBy.contact"
                  value={formData.reportedBy.contact}
                  onChange={handleChange}
                  placeholder="Contact Number"
                  className="form-input"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.imageUrl}
              className="btn btn-submit"
            >
              {loading ? (
                <span style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center'
                }}>
                  <div className="spinner" style={{
                    width: '1.25rem', 
                    height: '1.25rem', 
                    borderWidth: '2px', 
                    marginRight: '0.5rem'
                  }}></div>
                  Analyzing with AI...
                </span>
              ) : (
                'Submit Issue'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ReportIssue;