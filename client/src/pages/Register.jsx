import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import FormInput from '../components/FormInput';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', data);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {!success ? (
          <>
            <h2>Join Blood Bank Network</h2>
            <p className="auth-subtitle">Register as a healthcare professional</p>

            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
              <FormInput
                label="Full Name"
                type="text"
                {...register('name', { required: 'Name is required' })}
                error={errors.name?.message}
              />

              <FormInput
                label="Email Address"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  }
                })}
                error={errors.email?.message}
              />

              <FormInput
                label="Phone Number"
                type="tel"
                {...register('phone', { required: 'Phone number is required' })}
                error={errors.phone?.message}
              />

              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="form-control"
                  {...register('role', { required: 'Role is required' })}
                >
                  <option value="">Select your role</option>
                  <option value="DONOR">Blood Donor</option>
                  <option value="PATIENT">Patient</option>
                  <option value="BLOODBANK">Blood Bank Staff</option>
                </select>
                {errors.role && <div className="invalid-feedback">{errors.role.message}</div>}
              </div>

              <FormInput
                label="Password"
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                error={errors.password?.message}
              />

              {error && <div className="error-message">{error}</div>}

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </>
        ) : (
          <div className="success-message">
            <h2>Registration Successful!</h2>
            <div className="success-content">
              <p>Thank you for registering with the Blood Bank Management System.</p>
              <p>Your account has been created successfully. You can now login to access the system.</p>
              <button 
                className="btn btn-primary" 
                onClick={() => navigate('/login')}
              >
                Proceed to Login
              </button>
            </div>
          </div>
        )}

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;