import React, { useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './Dashboard.css';

const BloodBankDashboard = () => {
  const { user } = React.useContext(AuthContext);
  const [inventory, setInventory] = useState({});
  const [pendingRequests, setPendingRequests] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [stats, setStats] = useState({
    totalUnits: 0,
    pendingRequests: 0,
    emergencyRequests: 0,
    expiredUnits: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard summary
        const res = await api.get('/bloodbank/dashboard');
        const data = res.data;

        // Inventory summary
        setInventory(data.inventory || {});

        // Pending requests (count)
        setStats(prev => ({
          ...prev,
          totalUnits: data.stats?.totalUnits || 0,
          pendingRequests: data.stats?.pendingRequests || 0,
          emergencyRequests: data.stats?.emergencyRequests || 0,
          expiredUnits: 0 // Not provided, can be added if backend supports
        }));

        // Low stock alerts
        setLowStockAlerts(data.lowStockAlerts || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchDashboardData();
  }, []);


  const handleRequestAction = async (requestId, action) => {
    try {
      // TODO: Call API to approve/reject/complete request
      console.log(`${action} request ${requestId}`);

      // Update local state
      setPendingRequests(prev =>
        prev.map(req =>
          req.id === requestId
            ? { ...req, status: action === 'approve' ? 'APPROVED' : action === 'reject' ? 'REJECTED' : 'COMPLETED' }
            : req
        )
      );

      // Update stats
      setStats(prev => ({
        ...prev,
        pendingRequests: action === 'approve' || action === 'reject'
          ? prev.pendingRequests - 1
          : prev.pendingRequests
      }));

    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
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

  const getPriorityColor = (priority) => {
    return priority === 'Emergency' ? 'text-danger' : 'text-muted';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Blood Bank Dashboard</h1>
        <p className="welcome-text">Welcome back, {user?.name || 'Blood Bank Staff'}!</p>
        {stats.emergencyRequests > 0 && (
          <div className="emergency-banner">
            <div className="emergency-content">
              <span className="emergency-icon">🚨</span>
              <span className="emergency-text">
                {stats.emergencyRequests} emergency request{stats.emergencyRequests > 1 ? 's' : ''} pending
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="stats-grid">
        <div className="card">
          <div className="card-body">
            <h3>Total Inventory</h3>
            <p className="text-lg">{stats.totalUnits}</p>
            <small className="text-muted">units available</small>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3>Pending Requests</h3>
            <p className="text-lg">{stats.pendingRequests}</p>
            <small className="text-muted">awaiting action</small>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3>Emergency Requests</h3>
            <p className="text-lg">{stats.emergencyRequests}</p>
            <small className="text-muted">high priority</small>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3>Low Stock Alerts</h3>
            <p className="text-lg">{lowStockAlerts.length}</p>
            <small className="text-muted">blood groups</small>
          </div>
        </div>
      </div>

      {lowStockAlerts.length > 0 && (
        <div className="alerts-section">
          <h2>Low Stock Alerts</h2>
          <div className="alerts-grid">
            {lowStockAlerts.map((alert, index) => (
              <div key={index} className={`alert-card ${alert.severity.toLowerCase()}`}>
                <div className="alert-header">
                  <span className="blood-group">{alert.bloodGroup}</span>
                  <span className={`severity-badge ${alert.severity.toLowerCase()}`}>
                    {alert.severity}
                  </span>
                </div>
                <div className="alert-body">
                  <p><strong>Available:</strong> {alert.available} units</p>
                  <p className="alert-message">
                    {alert.severity === 'Critical'
                      ? 'Immediate restocking required!'
                      : 'Consider ordering more units'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3>Inventory Summary</h3>
          </div>
          <div className="card-body">
            <div className="inventory-grid">
              {Object.entries(inventory).map(([group, data]) => (
                <div key={group} className="inventory-item">
                  <div className="blood-group-header">{group}</div>
                  <div className="inventory-details">
                    <div className="detail-item">
                      <span className="label">Available:</span>
                      <span className="value available">{data.available}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Reserved:</span>
                      <span className="value reserved">{data.reserved}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Expiring Soon:</span>
                      <span className="value expiring">{data.expiringSoon}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Pending Requests</h3>
          </div>
          <div className="card-body">
            <div className="requests-list">
              {pendingRequests.filter(req => req.status === 'PENDING').map((request) => (
                <div key={request.id} className={`request-item ${request.priority.toLowerCase()}`}>
                  <div className="request-header">
                    <span className="hospital">{request.hospital}</span>
                    <span className={`priority-badge ${request.priority.toLowerCase()}`}>
                      {request.priority}
                    </span>
                  </div>
                  <div className="request-details">
                    <p><strong>Blood Group:</strong> {request.bloodGroup}</p>
                    <p><strong>Units:</strong> {request.units}</p>
                    <p><strong>Requested:</strong> {new Date(request.requestedDate).toLocaleDateString()}</p>
                    <p><strong>Requester:</strong> {request.requester}</p>
                  </div>
                  <div className="request-actions">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleRequestAction(request.id, 'approve')}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleRequestAction(request.id, 'reject')}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
              {pendingRequests.filter(req => req.status === 'PENDING').length === 0 && (
                <p className="no-requests">No pending requests</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>All Requests</h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Hospital</th>
                  <th>Blood Group</th>
                  <th>Units</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Requested Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((request) => (
                  <tr key={request.id} className={request.priority === 'Emergency' ? 'emergency-row' : ''}>
                    <td>{request.hospital}</td>
                    <td>{request.bloodGroup}</td>
                    <td>{request.units}</td>
                    <td>
                      <span className={getStatusColor(request.status)}>{request.status}</span>
                    </td>
                    <td>
                      <span className={getPriorityColor(request.priority)}>{request.priority}</span>
                    </td>
                    <td>{new Date(request.requestedDate).toLocaleDateString()}</td>
                    <td>
                      {request.status === 'PENDING' && (
                        <>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleRequestAction(request.id, 'approve')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRequestAction(request.id, 'reject')}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {request.status === 'APPROVED' && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleRequestAction(request.id, 'complete')}
                        >
                          Complete
                        </button>
                      )}
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

export default BloodBankDashboard;