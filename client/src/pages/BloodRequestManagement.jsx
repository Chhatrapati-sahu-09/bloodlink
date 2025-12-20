import React, { useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './Dashboard.css';

const BloodRequestManagement = () => {
  const { user } = React.useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, emergency

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await api.get('/bloodbank/requests');
        const data = res.data;
        const requestsArr = (data.requests || []).map(r => ({
          id: r._id,
          patientName: r.patientId?.userId?.name || '',
          patientId: r.patientId?._id || '',
          bloodGroup: r.bloodGroup,
          units: r.units,
          requestDate: r.requestDate ? new Date(r.requestDate).toISOString().split('T')[0] : '',
          status: r.status,
          fulfilledBy: r.fulfilledBy || '',
          fulfilledDate: r.fulfilledDate ? new Date(r.fulfilledDate).toISOString().split('T')[0] : '',
          notes: r.notes || '',
          urgency: r.urgency || '',
        }));
        setRequests(requestsArr);
      } catch (error) {
        // fallback: show nothing
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      // TODO: Replace with actual API call
      // await api.put(`/bloodbank/requests/${requestId}`, { status: newStatus });

      // Update local state
      setRequests(prevRequests =>
        prevRequests.map(request =>
          request.id === requestId
            ? { ...request, status: newStatus }
            : request
        )
      );

      // Show success message
      alert(`Request ${newStatus.toLowerCase()} successfully!`);
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Error updating request status. Please try again.');
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Emergency': return 'badge-danger';
      case 'High': return 'badge-warning';
      case 'Medium': return 'badge-info';
      case 'Low': return 'badge-secondary';
      default: return 'badge-secondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'text-warning';
      case 'APPROVED': return 'text-success';
      case 'REJECTED': return 'text-danger';
      case 'COMPLETED': return 'text-info';
      default: return 'text-muted';
    }
  };

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true;
    if (filter === 'pending') return request.status === 'PENDING';
    if (filter === 'emergency') return request.urgency === 'Emergency';
    return true;
  });

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading requests...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Blood Request Management</h1>
        <p className="welcome-text">Review and manage blood requests from hospitals</p>

        <div className="filter-controls">
          <div className="filter-buttons">
            <button
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('all')}
            >
              All Requests ({requests.length})
            </button>
            <button
              className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({requests.filter(r => r.status === 'PENDING').length})
            </button>
            <button
              className={`btn ${filter === 'emergency' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter('emergency')}
            >
              Emergency ({requests.filter(r => r.urgency === 'Emergency').length})
            </button>
          </div>
        </div>
      </div>

      <div className="requests-summary">
        <div className="stats-grid">
          <div className="card">
            <div className="card-body">
              <h3>Total Requests</h3>
              <p className="text-lg">{requests.length}</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h3>Pending Review</h3>
              <p className="text-lg">{requests.filter(r => r.status === 'PENDING').length}</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h3>Emergency</h3>
              <p className="text-lg">{requests.filter(r => r.urgency === 'Emergency').length}</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h3>Approved Today</h3>
              <p className="text-lg">{requests.filter(r => r.status === 'APPROVED').length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="requests-list">
        {filteredRequests.length > 0 ? (
          filteredRequests.map(request => (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <div className="request-info">
                  <h3>{request.patientName} ({request.patientAge} years)</h3>
                  <p className="hospital-name">{request.hospital}</p>
                  <p className="requester">Requested by: {request.requester}</p>
                </div>
                <div className="request-badges">
                  <span className={`badge ${getUrgencyColor(request.urgency)}`}>
                    {request.urgency}
                  </span>
                  <span className={getStatusColor(request.status)}>
                    {request.status}
                  </span>
                </div>
              </div>

              <div className="request-details">
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong>Blood Group:</strong> {request.bloodGroup}
                  </div>
                  <div className="detail-item">
                    <strong>Units Required:</strong> {request.units}
                  </div>
                  <div className="detail-item">
                    <strong>Requested Date:</strong> {request.requestedDate}
                  </div>
                  <div className="detail-item">
                    <strong>Contact:</strong> {request.contactPhone}
                  </div>
                </div>

                <div className="request-reason">
                  <strong>Reason:</strong> {request.reason}
                  {request.notes && (
                    <div className="notes">
                      <strong>Notes:</strong> {request.notes}
                    </div>
                  )}
                </div>
              </div>

              {request.status === 'PENDING' && (
                <div className="request-actions">
                  <button
                    className="btn btn-success"
                    onClick={() => handleStatusUpdate(request.id, 'APPROVED')}
                  >
                    Approve Request
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleStatusUpdate(request.id, 'REJECTED')}
                  >
                    Reject Request
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="no-requests">
            <p>No requests found matching the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodRequestManagement;