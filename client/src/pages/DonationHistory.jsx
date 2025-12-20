import React, { useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './Dashboard.css';

const DonationHistory = () => {
  const { user } = React.useContext(AuthContext);
  const [donationHistory, setDonationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalUnits: 0,
    lastDonation: null,
    nextEligible: null
  });

  useEffect(() => {
    const fetchDonationHistory = async () => {
      setLoading(true);
      try {
        const res = await api.get('/donor/profile');
        const data = res.data;
        const donationsArr = (data.donations || []).map(d => ({
          id: d._id,
          date: d.donationDate ? new Date(d.donationDate).toISOString().split('T')[0] : '',
          bloodGroup: d.bloodGroup,
          units: d.units,
          location: d.location || '',
          status: d.status,
          notes: d.notes || ''
        }));
        setDonationHistory(donationsArr);
        setStats({
          totalDonations: donationsArr.length,
          totalUnits: donationsArr.reduce((sum, d) => sum + d.units, 0),
          lastDonation: donationsArr[0]?.date || null,
          nextEligible: calculateNextEligibleDate(donationsArr[0]?.date)
        });
      } catch (error) {
        setDonationHistory([]);
        setStats({ totalDonations: 0, totalUnits: 0, lastDonation: null, nextEligible: null });
      } finally {
        setLoading(false);
      }
    };
    fetchDonationHistory();
  }, [user]);

  const calculateNextEligibleDate = (lastDonationDate) => {
    if (!lastDonationDate) return null;
    const lastDonation = new Date(lastDonationDate);
    const nextEligible = new Date(lastDonation);
    nextEligible.setDate(nextEligible.getDate() + 90);
    return nextEligible.toISOString().split('T')[0];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-success';
      case 'Pending': return 'text-warning';
      case 'Cancelled': return 'text-danger';
      default: return 'text-muted';
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading donation history...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Donation History</h1>
        <p className="welcome-text">Track your blood donation journey</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Donation Impact</h3>
        </div>
        <div className="card-body">
          <div className="impact-stats">
            <div className="impact-item">
              <div className="impact-number">{stats.totalUnits * 3}</div>
              <div className="impact-label">Lives Potentially Saved</div>
            </div>
            <div className="impact-item">
              <div className="impact-number">{Math.floor(stats.totalDonations / 4)}</div>
              <div className="impact-label">Years as Active Donor</div>
            </div>
            <div className="impact-item">
              <div className="impact-number">⭐</div>
              <div className="impact-label">Hero Status</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationHistory;