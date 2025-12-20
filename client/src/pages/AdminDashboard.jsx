import React, { useEffect, useState } from 'react';
import api from '../services/api';

const AdminDashboard = () => {
  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      <div className="stats-grid">
        <div className="card">
          <div className="card-body">
            <h3>Total Users</h3>
            <p className="text-lg">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3>Total Requests</h3>
            <p className="text-lg">{stats.totalRequests}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3>Pending Approvals</h3>
            <p className="text-lg">{stats.pendingApprovals}</p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h3>System Health</h3>
            <p className="text-lg text-success">{stats.systemHealth}</p>
          </div>
        </div>
      </div>

      <div className="d-flex justify-between mb-4">
        <div className="card" style={{ flex: 1, marginRight: '1rem' }}>
          <div className="card-header">
            <h3>Recent Users</h3>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>John Doe</td>
                    <td>Blood Bank</td>
                    <td>Pending</td>
                    <td>
                      <button className="btn btn-success btn-sm">Approve</button>
                      <button className="btn btn-danger btn-sm">Block</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card" style={{ flex: 1 }}>
          <div className="card-header">
            <h3>System Logs</h3>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>User</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>User Approved</td>
                    <td>Admin</td>
                    <td>2023-12-18 10:30</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;