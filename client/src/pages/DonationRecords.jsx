import React, { useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './Dashboard.css';

const DonationRecords = () => {
  const { user } = React.useContext(AuthContext);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalUnits: 0,
    uniqueDonors: 0,
    recentDonations: 0
  });
  const [filter, setFilter] = useState('all'); // all, today, week, month

  useEffect(() => {
    const fetchDonationRecords = async () => {
      setLoading(true);
      try {
        const res = await api.get('/bloodbank/donations');
        const data = res.data;
        const donationsArr = (data.donations || []).map(d => ({
          id: d._id,
          donorName: d.donorId?.userId?.name || '',
          donorId: d.donorId?._id || '',
          bloodGroup: d.bloodGroup,
          units: d.units,
          donationDate: d.donationDate ? new Date(d.donationDate).toISOString().split('T')[0] : '',
          location: d.location || '',
          status: d.status,
          notes: d.notes || '',
          testedBy: d.testedBy || '',
          expiryDate: d.expiryDate ? new Date(d.expiryDate).toISOString().split('T')[0] : ''
        }));
        setDonations(donationsArr);
        setStats({
          totalDonations: donationsArr.length,
          totalUnits: donationsArr.reduce((sum, d) => sum + d.units, 0),
          uniqueDonors: new Set(donationsArr.map(d => d.donorId)).size,
          recentDonations: donationsArr.filter(d => d.donationDate === new Date().toISOString().split('T')[0]).length
        });
      } catch (error) {
        // fallback: show nothing
      } finally {
        setLoading(false);
      }
    };
    fetchDonationRecords();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-success';
      case 'Pending': return 'text-warning';
      case 'Rejected': return 'text-danger';
      default: return 'text-muted';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getFilteredDonations = () => {
    const now = new Date();
    let startDate;

    switch (filter) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        return donations;
    }

    return donations.filter(donation =>
      new Date(donation.donationDate) >= startDate
    );
  };

  const filteredDonations = getFilteredDonations();

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading donation records...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Donation Records</h1>
        <p className="welcome-text">Track all blood donations and donor contributions</p>

        <div className="filter-controls">
          <div className="filter-buttons">
            <button
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('all')}
            >
              All Time ({donations.length})
            </button>
            <button
              className={`btn ${filter === 'today' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('today')}
            >
              Today ({stats.recentDonations})
            </button>
            <button
              className={`btn ${filter === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('week')}
            >
              This Week
            </button>
            <button
              className={`btn ${filter === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('month')}
            >
              This Month
            </button>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="card">
          <div className="card-body">
            <h3>Total Donations</h3>
            <p className="text-lg">{stats.totalDonations}</p>
            <small className="text-muted">All time</small>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3>Total Units Collected</h3>
            <p className="text-lg">{stats.totalUnits}</p>
            <small className="text-muted">Units of blood</small>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3>Unique Donors</h3>
            <p className="text-lg">{stats.uniqueDonors}</p>
            <small className="text-muted">Active contributors</small>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3>Today's Donations</h3>
            <p className="text-lg">{stats.recentDonations}</p>
            <small className="text-muted">Recent activity</small>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Donation Records</h3>
          <p className="text-muted">Complete history of blood donations</p>
        </div>
        <div className="card-body">
          {filteredDonations.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Donor</th>
                    <th>Blood Group</th>
                    <th>Units</th>
                    <th>Date & Time</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Tested By</th>
                    <th>Expiry Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDonations.map(donation => (
                    <tr key={donation.id}>
                      <td>
                        <div>
                          <strong>{donation.donorName}</strong>
                          <br />
                          <small className="text-muted">ID: {donation.donorId}</small>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-primary">{donation.bloodGroup}</span>
                      </td>
                      <td>{donation.units}</td>
                      <td>
                        {formatDate(donation.donationDate)}
                        <br />
                        <small className="text-muted">{donation.donationTime}</small>
                      </td>
                      <td>{donation.location}</td>
                      <td>
                        <span className={getStatusColor(donation.status)}>
                          {donation.status}
                        </span>
                      </td>
                      <td>{donation.testedBy}</td>
                      <td>{formatDate(donation.expiryDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-muted">No donation records found for the selected period.</p>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Blood Group Distribution</h3>
        </div>
        <div className="card-body">
          <div className="blood-group-stats">
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => {
              const count = donations.filter(d => d.bloodGroup === group).length;
              const percentage = donations.length > 0 ? ((count / donations.length) * 100).toFixed(1) : 0;
              return (
                <div key={group} className="blood-group-item">
                  <span className="blood-group-label">{group}</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="blood-group-count">{count} ({percentage}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationRecords;