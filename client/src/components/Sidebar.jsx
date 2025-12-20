import React from 'react';
import { AuthContext } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = React.useContext(AuthContext);

  if (!user) return null;

  const menuItems = {
    DONOR: [
      { label: 'Dashboard', path: '/donor-dashboard' },
      { label: 'My Profile', path: '/donor-profile' },
      { label: 'Donation History', path: '/donation-history' }
    ],
    BLOODBANK: [
      { label: 'Dashboard', path: '/blood-bank-dashboard' },
      { label: 'Inventory', path: '/inventory-management' },
      { label: 'Request Management', path: '/blood-request-management' },
      { label: 'Donation Records', path: '/donation-records' }
    ],
    HOSPITAL: [
      { label: 'Dashboard', path: '/hospital-dashboard' },
      { label: 'Blood Search', path: '/blood-search' },
      { label: 'New Request', path: '/blood-request' },
      { label: 'My Requests', path: '/request-tracking' }
    ],
    ADMIN: [
      { label: 'Dashboard', path: '/admin-dashboard' },
      { label: 'Statistics', path: '/admin-dashboard' },
      { label: 'User Management', path: '/admin-dashboard' },
      { label: 'Audit Logs', path: '/admin-dashboard' }
    ]
  };

  const items = menuItems[user.role] || [];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              <a href={item.path} className="sidebar-link">{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;