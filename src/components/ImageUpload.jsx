import { useState } from 'react';
import { uploadImage } from '../services/api';

function ImageUpload({ onImageUploaded, error }) {
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await processFile(file);
    }
  };

  

  const processFile = async (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload to server
    try {
      setUploading(true);
      const response = await uploadImage(file);
      onImageUploaded(response.data.imageUrl);
    } catch (err) {
      alert('Failed to upload image: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">Upload Image *</label>
      
      {/* Drag & Drop Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: dragActive ? '3px dashed #2563eb' : '2px dashed #d1d5db',
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: dragActive ? '#eff6ff' : '#f9fafb',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        {preview ? (
          <div style={{ position: 'relative' }}>
            <img 
              src={preview} 
              alt="Preview" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '300px', 
                borderRadius: '6px',
                marginBottom: '1rem'
              }} 
            />
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                onImageUploaded('');
              }}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                fontSize: '1.25rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              ×
            </button>
          </div>
        ) : uploading ? (
          <div>
            <div className="spinner" style={{ margin: '0 auto' }}></div>
            <p style={{ marginTop: '1rem', color: '#6b7280' }}>Uploading image...</p>
          </div>
        ) : (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</div>
            <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
              <strong>Click to upload</strong> or drag and drop
            </p>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              PNG, JPG, GIF or WEBP (Max 5MB)
            </p>
            
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="btn"
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.5rem 1.5rem',
                cursor: 'pointer',
                display: 'inline-block'
              }}
            >
              Choose File
            </label>
          </>
        )}
      </div>

      {error && (
        <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
          {error}
        </p>
      )}

      <p className="form-hint" style={{ marginTop: '0.5rem' }}>
        📱 You can also take a photo directly from your phone camera
      </p>
    </div>
  );
}

export default ImageUpload;