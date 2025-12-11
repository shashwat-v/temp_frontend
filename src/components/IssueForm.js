import React, { useState } from 'react';
import { issuesAPI } from '../services/api';
import './IssueForm.css';

const IssueForm = ({ position, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'pothole',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      setSelectedImage(file);
      setError('');

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('latitude', position.lat);
      formDataToSend.append('longitude', position.lng);
      formDataToSend.append('address', `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`);

      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      await issuesAPI.createIssue(formDataToSend);
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating issue:', err);

      let errorMessage = 'Failed to create issue';
      if (err.response) {
        errorMessage = err.response.data?.error ||
          err.response.data?.message ||
          `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'No response from server. Is the backend running?';
      } else {
        errorMessage = err.message || 'Failed to create issue';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="issue-form-overlay">
      <div className="issue-form-modal">
        <div className="issue-form-header">
          <h2>Report Issue</h2>
          <button className="close-btn" onClick={onClose} disabled={loading}>
            ×
          </button>
        </div>

        <p className="location-text">
          📍 Location: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
        </p>

        {error && (
          <div className="alert alert-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="issue-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Large pothole on main road"
              required
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the issue in detail..."
              required
              maxLength={1000}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="pothole">🕳️ Pothole</option>
              <option value="garbage">🗑️ Garbage</option>
              <option value="streetlight">💡 Streetlight</option>
              <option value="water">💧 Water Issue</option>
              <option value="traffic">🚦 Traffic Problem</option>
              <option value="other">📍 Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="image">Upload Image (Optional)</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            <p className="help-text">Max size: 5MB. Formats: JPG, PNG, GIF, WebP</p>

            {imagePreview && (
              <div className="image-preview-container">
                <img src={imagePreview} alt="Preview" className="image-preview" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="remove-image-btn"
                  title="Remove image"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Submitting...' : '✓ Submit Issue'}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueForm;