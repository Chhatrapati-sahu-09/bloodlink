import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './Dashboard.css';

const HospitalDashboard = () => {
  const { user } = React.useContext(AuthContext);
  const [requestStats, setRequestStats] = useState({
    active: 3,
    completed: 12,
    rejected: 1,
    total: 16
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientDashboard = async () => {
      setLoading(true);
      try {
        const res = await api.get('/patient/dashboard');
        const data = res.data;
        setRecentRequests(
          (data.recentRequests || []).map(r => ({
            id: r._id,
            date: r.requestedAt ? new Date(r.requestedAt).toISOString().split('T')[0] : '',
            bloodGroup: r.bloodGroup,
            units: r.units,
            status: r.status,
            urgency: r.urgency,
            patientName: r.patientName || ''
          }))
        );
        setRequestStats({
          active: data.stats?.pendingRequests || 0,
          completed: data.stats?.completedRequests || 0,
          rejected: data.stats?.rejectedRequests || 0,
          total: data.stats?.totalRequests || 0
        });
      } catch (error) {
        // fallback: show nothing
      } finally {
        setLoading(false);
      }
    };
    fetchPatientDashboard();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'text-warning';
      case 'APPROVED': return 'text-info';
      case 'COMPLETED': return 'text-success';
      case 'REJECTED': return 'text-danger';
      default: return 'text-muted';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'High': return 'badge-danger';
      case 'Medium': return 'badge-warning';
      case 'Low': return 'badge-success';
      default: return 'badge-secondary';
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Patient Dashboard</h1>
        <p className="welcome-text">Welcome back, {user?.name || 'Patient'}!</p>
        <div className="dashboard-actions">
          <Link to="/blood-search" className="btn btn-primary">Search Blood</Link>
          <Link to="/blood-request" className="btn btn-success">New Request</Link>
          <Link to="/request-tracking" className="btn btn-outline-primary">Track Requests</Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="card">
          <div className="card-body">
            <h3>Active Requests</h3>
            <p className="text-lg">{requestStats.active}</p>
            <small className="text-muted">Currently pending</small>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3>Completed Requests</h3>
            <p className="text-lg">{requestStats.completed}</p>
            <small className="text-muted">Successfully fulfilled</small>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3>Rejected Requests</h3>
            <p className="text-lg">{requestStats.rejected}</p>
            <small className="text-muted">Could not fulfill</small>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3>Total Requests</h3>
            <p className="text-lg">{requestStats.total}</p>
            <small className="text-muted">All time</small>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3>Recent Requests</h3>
            <Link to="/request-tracking" className="btn btn-sm btn-outline-primary">View All</Link>
          </div>
          <div className="card-body">
            {recentRequests.length > 0 ? (
              <div className="requests-list">
                {recentRequests.map(request => (
                  <div key={request.id} className="request-item">
                    <div className="request-header">
                      <strong>{request.patientName}</strong>
                      <span className={`badge ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency}
                      </span>
                    </div>
                    <div className="request-details">
                      <span>{request.bloodGroup} - {request.units} units</span>
                      <span className={getStatusColor(request.status)}>{request.status}</span>
                    </div>
                    <small className="text-muted">{request.date}</small>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No recent requests</p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="card-body">
            <div className="quick-actions">
              <Link to="/blood-search" className="action-item">
                <div className="action-icon">🔍</div>
                <div className="action-text">
                  <strong>Search Blood</strong>
                  <small>Find available blood banks</small>
                </div>
              </Link>
              <Link to="/blood-request" className="action-item">
                <div className="action-icon">📝</div>
                <div className="action-text">
                  <strong>New Request</strong>
                  <small>Submit blood requirement</small>
                </div>
              </Link>
              <Link to="/request-tracking" className="action-item">
                <div className="action-icon">📊</div>
                <div className="action-text">
                  <strong>Track Requests</strong>
                  <small>Monitor request status</small>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Request History Summary</h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Patient</th>
                  <th>Blood Group</th>
                  <th>Units</th>
                  <th>Status</th>
                  <th>Urgency</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map(request => (
                  <tr key={request.id}>
                    <td>{request.date}</td>
                    <td>{request.patientName}</td>
                    <td>{request.bloodGroup}</td>
                    <td>{request.units}</td>
                    <td>
                      <span className={getStatusColor(request.status)}>
                        {request.status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency}
                      </span>
                    </td>
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

export default HospitalDashboard;