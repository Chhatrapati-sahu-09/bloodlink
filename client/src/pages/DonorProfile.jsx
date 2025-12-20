import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import FormInput from '../components/FormInput';
import './Auth.css';

const DonorProfile = () => {
  const { user } = React.useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profileData, setProfileData] = useState({
    age: '',
    weight: '',
    medicalConditions: '',
    lastDonationDate: '',
    bloodGroup: 'O+',
    eligibilityStatus: 'Eligible'
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm();

  useEffect(() => {
    // TODO: Fetch donor profile data from API
    // For now, load sample data
    const sampleData = {
      age: '28',
      weight: '70',
      medicalConditions: 'None',
      lastDonationDate: '2024-10-15',
      bloodGroup: 'O+'
    };

    Object.keys(sampleData).forEach(key => {
      setValue(key, sampleData[key]);
    });
    setProfileData(prev => ({ ...prev, ...sampleData }));
  }, [setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // TODO: Update donor profile via API
      console.log('Updating profile:', data);

      // Calculate eligibility based on 90-day rule
      const lastDonation = new Date(data.lastDonationDate);
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const isEligible = lastDonation <= ninetyDaysAgo;
      const nextEligibleDate = new Date(lastDonation);
      nextEligibleDate.setDate(nextEligibleDate.getDate() + 90);

      setProfileData(prev => ({
        ...prev,
        ...data,
        eligibilityStatus: isEligible ? 'Eligible' : 'Not Eligible',
        nextDonationDate: nextEligibleDate.toISOString().split('T')[0]
      }));

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateEligibility = (lastDonationDate) => {
    if (!lastDonationDate) return { status: 'Unknown', nextDate: null };

    const lastDonation = new Date(lastDonationDate);
    const now = new Date();
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(now.getDate() - 90);

    if (lastDonation <= ninetyDaysAgo) {
      return { status: 'Eligible', nextDate: null };
    } else {
      const nextEligible = new Date(lastDonation);
      nextEligible.setDate(nextEligible.getDate() + 90);
      return { status: 'Not Eligible', nextDate: nextEligible.toISOString().split('T')[0] };
    }
  };

  const eligibility = calculateEligibility(profileData.lastDonationDate);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Donor Profile</h2>
        <p className="auth-subtitle">Manage your health information and donation eligibility</p>

        <div className="profile-status">
          <div className="status-card">
            <h4>Current Status</h4>
            <p className={`status ${eligibility.status === 'Eligible' ? 'eligible' : 'not-eligible'}`}>
              {eligibility.status}
            </p>
            {eligibility.nextDate && (
              <p className="next-date">Next eligible: {eligibility.nextDate}</p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-grid">
            <FormInput
              label="Age"
              type="number"
              {...register('age', {
                required: 'Age is required',
                min: { value: 18, message: 'Must be 18 or older' },
                max: { value: 65, message: 'Must be 65 or younger' }
              })}
              error={errors.age?.message}
            />

            <FormInput
              label="Weight (kg)"
              type="number"
              {...register('weight', {
                required: 'Weight is required',
                min: { value: 50, message: 'Minimum weight is 50kg' }
              })}
              error={errors.weight?.message}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Medical Conditions</label>
            <textarea
              className="form-control"
              rows="3"
              {...register('medicalConditions')}
              placeholder="List any medical conditions, medications, or health concerns..."
            />
          </div>

          <FormInput
            label="Last Donation Date"
            type="date"
            {...register('lastDonationDate', { required: 'Last donation date is required' })}
            error={errors.lastDonationDate?.message}
          />

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

          {success && (
            <div className="success-message">
              Profile updated successfully! Your eligibility status has been recalculated.
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating Profile...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonorProfile;