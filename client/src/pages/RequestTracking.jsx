import React, { useState, useEffect } from 'react';
import './RequestTracking.css';

const RequestTracking = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // TODO: Fetch user's requests from API
    // Sample data
    setRequests([
      {
        id: 1,
        bloodGroup: 'O-',
        units: 2,
        status: 'PENDING',
        requestedAt: '2023-12-15',
        location: 'City Hospital'
      },
      {
        id: 2,
        bloodGroup: 'A+',
        units: 3,
        status: 'APPROVED',
        requestedAt: '2023-12-10',
        location: 'Metro Hospital',
        approvedAt: '2023-12-12'
      },
      {
        id: 3,
        bloodGroup: 'B-',
        units: 1,
        status: 'COMPLETED',
        requestedAt: '2023-12-05',
        location: 'Regional Clinic',
        approvedAt: '2023-12-06',
        completedAt: '2023-12-08'
      }
    ]);
  }, []);

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { class: 'badge-pending', text: 'Pending' },
      APPROVED: { class: 'badge-approved', text: 'Approved' },
      REJECTED: { class: 'badge-rejected', text: 'Rejected' },
      COMPLETED: { class: 'badge-completed', text: 'Completed' }
    };
    return badges[status] || { class: 'badge-default', text: status };
  };

  const getTimelineSteps = (request) => {
    const steps = [
      { label: 'Requested', date: request.requestedAt, active: true },
      { label: 'Approved', date: request.approvedAt, active: request.status !== 'PENDING' && request.status !== 'REJECTED' },
      { label: 'Completed', date: request.completedAt, active: request.status === 'COMPLETED' }
    ];
    return steps;
  };

  return (
    <div className="request-tracking">
      <h1>Blood Request Tracking</h1>
      <p className="page-subtitle">Monitor the status of your blood requests</p>

      <div className="requests-list">
        {requests.map((request) => {
          const badge = getStatusBadge(request.status);
          const timeline = getTimelineSteps(request);

          return (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <div className="request-info">
                  <h3>{request.bloodGroup} - {request.units} units</h3>
                  <p className="request-location">{request.location}</p>
                </div>
                <span className={`status-badge ${badge.class}`}>
                  {badge.text}
                </span>
              </div>

              <div className="request-timeline">
                {timeline.map((step, index) => (
                  <div key={index} className={`timeline-step ${step.active ? 'active' : ''}`}>
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="timeline-label">{step.label}</div>
                      {step.date && <div className="timeline-date">{step.date}</div>}
                    </div>
                    {index < timeline.length - 1 && <div className="timeline-line"></div>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RequestTracking;