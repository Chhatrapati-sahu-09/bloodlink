import React from "react";
import "./Footer.css";

const Footer = () => (
  <footer className="footer">
    <div className="footer__container">
      <div className="footer__row">
        <div className="footer__col footer__brand">
          <div className="footer__logo">
            <img src="/Screenshot 2025-12-20 225730.png" alt="BloodLink Logo" className="footer-logo-img" height="36" />
          </div>
          <div className="footer__desc">
            Connecting donors, blood banks, and hospitals when it matters most. Our mission is to ensure every patient has access to safe blood.
          </div>
        </div>
        <div className="footer__col">
          <div className="footer__col-title">Quick Links</div>
          <ul className="footer__links">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/blood-search">Find Blood</a></li>
            <li><a href="/register">Become a Donor</a></li>
          </ul>
        </div>
        <div className="footer__col">
          <div className="footer__col-title">Contact</div>
          <ul className="footer__links">
            <li>Email: contact@lifestream.org</li>
            <li>Phone: +1 (555) 000-0000</li>
            <li>Address: 123 Health Ave, Medical District</li>
          </ul>
        </div>
        <div className="footer__col">
          <div className="footer__col-title">Legal</div>
          <ul className="footer__links">
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/disclaimer">Disclaimer</a></li>
          </ul>
        </div>
      </div>
      <div className="footer__divider"></div>
      <div className="footer__copyright-row">
        <span className="footer__copyright">&copy; {new Date().getFullYear()} BloodLink Blood Bank Management System. All rights reserved.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
