import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          <img src="/Screenshot 2025-12-20 225730.png" alt="BloodLink Logo" className="navbar-logo-img" height="38" />
        </Link>
        <nav className="nav">
          {user ? (
            <>
              <span>Welcome, {user.name}</span>
              {user.role === 'DONOR' && (
                <Link to="/donor-profile" className="nav-link">My Profile</Link>
              )}
              <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;