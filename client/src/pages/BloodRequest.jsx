import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import FormInput from '../components/FormInput';
import './Auth.css';

const BloodRequest = () => {
  const { user } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedBloodBank, setSelectedBloodBank] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const bloodGroup = watch('bloodGroup');
  const units = watch('units');

  // Sample blood banks - in real app, this would come from API
  const bloodBanks = [
    { id: 1, name: 'City Blood Bank', location: 'Downtown' },
    { id: 2, name: 'Metro Hospital Blood Center', location: 'Midtown' },
    { id: 3, name: 'Regional Blood Center', location: 'Uptown' },
    { id: 4, name: 'Central Hospital', location: 'City Center' }
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // TODO: Submit blood request to API
      console.log('Submitting blood request:', { ...data, bloodBankId: selectedBloodBank });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess(true);
      setTimeout(() => {
        navigate('/request-tracking');
      }, 2000);
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateUrgency = (units) => {
    if (units <= 1) return 'Low';
    if (units <= 3) return 'Medium';
    return 'High';
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="success-message">
            <h2>Request Submitted Successfully!</h2>
            <div className="success-content">
              <p>Your blood request has been submitted and is now pending approval.</p>
              <p><strong>Status:</strong> PENDING</p>
              <p>You will be redirected to request tracking...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Request Blood</h2>
        <p className="auth-subtitle">Submit a blood requirement request</p>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select
                className="form-control"
                {...register('bloodGroup', { required: 'Blood group is required' })}
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
              {errors.bloodGroup && <div className="invalid-feedback">{errors.bloodGroup.message}</div>}
            </div>

            <FormInput
              label="Units Required"
              type="number"
              {...register('units', {
                required: 'Units are required',
                min: { value: 1, message: 'Minimum 1 unit required' },
                max: { value: 10, message: 'Maximum 10 units allowed' }
              })}
              error={errors.units?.message}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Blood Bank</label>
            <select
              className="form-control"
              value={selectedBloodBank}
              onChange={(e) => setSelectedBloodBank(e.target.value)}
              required
            >
              <option value="">Select blood bank</option>
              {bloodBanks.map(bank => (
                <option key={bank.id} value={bank.id}>
                  {bank.name} - {bank.location}
                </option>
              ))}
            </select>
            {!selectedBloodBank && <div className="invalid-feedback">Blood bank selection is required</div>}
          </div>

          <FormInput
            label="Patient Name"
            type="text"
            {...register('patientName', { required: 'Patient name is required' })}
            error={errors.patientName?.message}
          />

          <FormInput
            label="Patient Age"
            type="number"
            {...register('patientAge', {
              required: 'Patient age is required',
              min: { value: 1, message: 'Valid age required' },
              max: { value: 120, message: 'Valid age required' }
            })}
            error={errors.patientAge?.message}
          />

          <div className="form-group">
            <label className="form-label">Urgency Level</label>
            <input
              type="text"
              className="form-control"
              value={units ? calculateUrgency(units) : 'Select units to see urgency'}
              readOnly
            />
            <small className="form-text text-muted">
              Urgency is automatically calculated based on units required
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Reason for Request</label>
            <textarea
              className="form-control"
              rows="3"
              {...register('reason', { required: 'Reason is required' })}
              placeholder="Please provide details about why blood is needed..."
            />
            {errors.reason && <div className="invalid-feedback">{errors.reason.message}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Contact Information</label>
            <FormInput
              type="tel"
              {...register('contactPhone', { required: 'Contact phone is required' })}
              error={errors.contactPhone?.message}
              placeholder="Emergency contact number"
            />
          </div>

          <div className="request-summary">
            <h4>Request Summary</h4>
            <div className="summary-details">
              <p><strong>Blood Group:</strong> {bloodGroup || 'Not selected'}</p>
              <p><strong>Units:</strong> {units || 'Not specified'}</p>
              <p><strong>Urgency:</strong> {units ? calculateUrgency(units) : 'Not calculated'}</p>
              <p><strong>Status:</strong> <span className="status-pending">PENDING</span></p>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !selectedBloodBank}
          >
            {loading ? 'Submitting Request...' : 'Submit Blood Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BloodRequest;