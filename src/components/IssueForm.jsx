import { useState } from 'react';

function IssueForm({ onSubmit, loading, error }) {
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
        },
        (error) => {
          alert('Unable to get location: ' + error.message);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      
      {/* Image URL */}
      <div className="form-group">
        <label className="form-label">Image URL *</label>
        <input
          type="url"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          required
          placeholder="https://images.unsplash.com/photo-..."
          className="form-input"
        />
        <p className="form-hint">
          📸 Use an Unsplash image URL for testing or upload your own
        </p>
      </div>

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
            placeholder="Latitude (e.g., 28.7041)"
            className="form-input"
          />
          <input
            type="number"
            step="any"
            name="location.longitude"
            value={formData.location.longitude}
            onChange={handleChange}
            required
            placeholder="Longitude (e.g., 77.1025)"
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

      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
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
  );
}

export default IssueForm;