import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';


import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  return (
    <div className="app">
      <Header />
      <div className={isHome ? 'main-content--home' : 'main-content'}>
        {!isHome && <Sidebar />}
        <main className={isHome ? 'content--home' : 'content'}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;