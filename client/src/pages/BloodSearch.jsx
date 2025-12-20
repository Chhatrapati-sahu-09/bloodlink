import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import './BloodSearch.css';

const BloodSearch = () => {
  const { user } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    bloodGroup: '',
    location: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = {};
      if (searchParams.bloodGroup) params.bloodGroup = searchParams.bloodGroup;
      if (searchParams.location) params.location = searchParams.location;
      const res = await api.get('/patient/search-blood', { params });
      const data = res.data;
      const resultsArr = (data.availableBlood || []).map(b => ({
        id: b._id || b.bloodBankId || Math.random(),
        bloodBank: b.bloodBankName || b.bloodBank || '',
        location: b.location || '',
        availableUnits: b.totalUnits || b.units || 0,
        contact: b.contact || ''
      }));
      setSearchResults(resultsArr);
    } catch (error) {
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = (bloodBankId) => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }
    // TODO: Navigate to request form or call API
    alert(`Request initiated for blood bank ${bloodBankId}. Please complete the request form.`);
  };

  return (
    <div className="blood-search">
      <h1>Find Blood</h1>
      <p className="page-subtitle">Check blood availability and connect with blood banks in your area</p>

      <form onSubmit={handleSearch} className="search-form">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Blood Group</label>
            <select
              name="bloodGroup"
              value={searchParams.bloodGroup}
              onChange={handleInputChange}
              className="form-control"
              required
            >
              <option value="">Select blood group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <FormInput
            label="Location"
            name="location"
            value={searchParams.location}
            onChange={handleInputChange}
            placeholder="Enter city or area"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search Blood'}
        </button>
      </form>

      {searchResults.length > 0 && (
        <div className="results-section">
          <h2>Available Blood Banks</h2>
          <div className="blood-bank-list">
            {searchResults.map((result) => (
              <div key={result.id} className="blood-bank-card">
                <div className="card-header">
                  <h3>{result.bloodBank}</h3>
                  <span className="location">{result.location}</span>
                </div>
                <div className="card-body">
                  <p><strong>Available Units:</strong> {result.availableUnits}</p>
                  <p><strong>Contact:</strong> {result.contact}</p>
                </div>
                <div className="card-footer">
                  <button
                    className="btn btn-success"
                    onClick={() => handleRequest(result.id)}
                  >
                    {user ? 'Request Blood' : 'Login to Request'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {!user && (
            <div className="login-prompt">
              <p><em>Login required to submit blood requests</em></p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BloodSearch;