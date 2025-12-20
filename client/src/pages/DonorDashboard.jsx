import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './Dashboard.css';

const DonorDashboard = () => {
  const { user } = React.useContext(AuthContext);
  const [donorData, setDonorData] = useState({
    eligibilityStatus: '',
    nextDonationDate: '',
    lastDonation: '',
    totalDonations: 0,
    bloodGroup: ''
  });
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);
  const [donationHistory, setDonationHistory] = useState([]);

  useEffect(() => {
    const fetchDonorData = async () => {
      try {
        // Fetch donor profile
        const profileRes = await api.get('/donor/profile');
        const donor = profileRes.data;

        // Calculate eligibility
        let eligibilityStatus = 'Unknown';
        let nextDonationDate = '';
        let lastDonation = '';
        if (donor.lastDonationDate) {
          const last = new Date(donor.lastDonationDate);
          lastDonation = last.toISOString().split('T')[0];
          const ninetyDaysAgo = new Date();
          ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
          if (last <= ninetyDaysAgo) {
            eligibilityStatus = 'Eligible';
          } else {
            eligibilityStatus = 'Not Eligible';
            const nextEligible = new Date(last);
            nextEligible.setDate(nextEligible.getDate() + 90);
            nextDonationDate = nextEligible.toISOString().split('T')[0];
          }
        }

        // Fetch donation history
        // (Assuming endpoint exists: /bloodbank/donations?donorId=...)
        let donationHistoryArr = [];
        let totalDonations = 0;
        try {
          const donationsRes = await api.get('/bloodbank/donations');
          // Filter for this donor
          const userId = user?._id || user?.id;
          const filtered = donationsRes.data.donations?.filter(d => d.donorId?.userId === userId);
          donationHistoryArr = (filtered || []).map(d => ({
            date: d.donationDate ? new Date(d.donationDate).toISOString().split('T')[0] : '',
            bloodGroup: d.bloodGroup,
            units: d.units,
            location: d.location || d.bloodBankName || ''
          }));
          totalDonations = donationHistoryArr.length;
        } catch (e) {
          // fallback: no donation history
        }

        setDonorData({
          eligibilityStatus,
          nextDonationDate,
          lastDonation,
          totalDonations,
          bloodGroup: donor.bloodGroup || ''
        });
        setDonationHistory(donationHistoryArr);
      } catch (err) {
        // fallback: show nothing
      }
    };
    fetchDonorData();
  }, [user]);

  const getEligibilityColor = (status) => {
    switch (status) {
      case 'Eligible': return 'text-success';
      case 'Not Eligible': return 'text-danger';
      case 'Pending': return 'text-warning';
      default: return 'text-muted';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'High': return 'alert-danger';
      case 'Medium': return 'alert-warning';
      case 'Low': return 'alert-info';
      default: return 'alert-secondary';
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Donor Dashboard</h1>
        <p className="welcome-text">Welcome back, {user?.name || 'Donor'}!</p>
        <div className="dashboard-actions">
          <Link to="/donor-profile" className="btn btn-secondary">Update Profile</Link>
          <Link to="/donation-history" className="btn btn-outline-primary">View History</Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="card">
          <div className="card-body">
            <h3>Eligibility Status</h3>
            <p className={`text-lg ${getEligibilityColor(donorData.eligibilityStatus)}`}>
              {donorData.eligibilityStatus}
            </p>
            <small className="text-muted">
              {donorData.eligibilityStatus === 'Eligible' 
                ? 'You can donate blood now' 
                : 'Check with your doctor'}
            </small>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3>Next Donation Date</h3>
            <p className="text-lg">{donorData.nextDonationDate}</p>
            <small className="text-muted">
              {new Date(donorData.nextDonationDate) > new Date() 
                ? `${Math.ceil((new Date(donorData.nextDonationDate) - new Date()) / (1000 * 60 * 60 * 24))} days remaining`
                : 'Available now'}
            </small>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3>Last Donation</h3>
            <p className="text-lg">{donorData.lastDonation}</p>
            <small className="text-muted">Blood Group: {donorData.bloodGroup}</small>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3>Total Donations</h3>
            <p className="text-lg">{donorData.totalDonations}</p>
            <small className="text-muted">Lifetime contributions</small>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3>Emergency Blood Alerts</h3>
          </div>
          <div className="card-body">
            {emergencyAlerts.length > 0 ? (
              <div className="alerts-list">
                {emergencyAlerts.map(alert => (
                  <div key={alert.id} className={`alert ${getUrgencyColor(alert.urgency)}`}>
                    <div className="alert-header">
                      <strong>{alert.type}</strong>
                      <span className="badge">{alert.urgency} Priority</span>
                    </div>
                    <p><strong>Blood Group:</strong> {alert.bloodGroup}</p>
                    <p><strong>Location:</strong> {alert.location}</p>
                    <p><strong>Date:</strong> {alert.date}</p>
                    <button className="btn btn-sm btn-primary">
                      Respond to Alert
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No active emergency alerts</p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Donation Summary</h3>
          </div>
          <div className="card-body">
            <div className="summary-stats">
              <div className="summary-item">
                <span className="label">Blood Group:</span>
                <span className="value">{donorData.bloodGroup}</span>
              </div>
              <div className="summary-item">
                <span className="label">Total Units Donated:</span>
                <span className="value">{donorData.totalDonations}</span>
              </div>
              <div className="summary-item">
                <span className="label">Lives Potentially Saved:</span>
                <span className="value">{donorData.totalDonations * 3}</span>
              </div>
              <div className="summary-item">
                <span className="label">Donor Status:</span>
                <span className="value badge-success">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Recent Donation History</h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Blood Group</th>
                  <th>Units</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {donationHistory.map((donation, index) => (
                  <tr key={index}>
                    <td>{donation.date}</td>
                    <td>{donation.bloodGroup}</td>
                    <td>{donation.units}</td>
                    <td>{donation.location}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;