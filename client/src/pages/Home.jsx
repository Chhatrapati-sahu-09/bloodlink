      <footer className="footer">
        <div className="footer__container">
          <span className="footer__copyright">&copy; {new Date().getFullYear()} Blood Bank Management. All rights reserved.</span>
        </div>
      </footer>



import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      <main className="home-hero home-hero--bg">
        <div className="home-hero__overlay">
          <div className="home-hero__content">
            <h1 className="home-hero__heading">
              Connecting Donors, Blood<br />
              Banks, and Hospitals — <span className="highlight-red">When</span><br />
              <span className="highlight-red">It Matters Most</span>
            </h1>
            <p className="home-hero__desc">
              A reliable platform to manage blood inventory, connect donors with those<br />
              in need, and streamline life-saving requests in real-time.
            </p>
            <div className="home-hero__actions">
              <Link to="/blood-search" className="btn btn-primary">Find Blood Now</Link>
              <Link to="/register" className="btn btn-secondary">Register as Donor</Link>
            </div>
          </div>
        </div>
      </main>

      {/* Blood Availability Section */}
      <section className="blood-availability-section">
        <div className="blood-availability__container">
          <h2 className="blood-availability__heading">Blood Availability</h2>
          <p className="blood-availability__subheading">Current real-time stock levels across all connected blood banks</p>
          <div className="blood-availability__cards">
            <div className="blood-card"><span className="blood-card__label">A+</span><span className="badge badge--available">Available</span></div>
            <div className="blood-card"><span className="blood-card__label">A-</span><span className="badge badge--available">Available</span></div>
            <div className="blood-card"><span className="blood-card__label">B+</span><span className="badge badge--available">Available</span></div>
            <div className="blood-card"><span className="blood-card__label">B-</span><span className="badge badge--available">Available</span></div>
            <div className="blood-card"><span className="blood-card__label">AB+</span><span className="badge badge--available">Available</span></div>
            <div className="blood-card"><span className="blood-card__label">AB-</span><span className="badge badge--limited">Limited</span></div>
            <div className="blood-card"><span className="blood-card__label">O+</span><span className="badge badge--available">Available</span></div>
            <div className="blood-card"><span className="blood-card__label">O-</span><span className="badge badge--limited">Limited</span></div>
          </div>
        </div>
      </section>



      <section className="system-modules-section">
        <div className="system-modules__container">
          <h2 className="system-modules__heading">System Modules</h2>
          <p className="system-modules__subheading">Tailored interfaces for every role in the ecosystem</p>
          <div className="system-modules__cards">
            <div className="system-module-card">
              <div className="system-module-card__title">Donor Module</div>
              <div className="system-module-card__subtitle">For life-savers</div>
              <ul className="system-module-card__list">
                <li>Manage personal health profile</li>
                <li>Track donation history</li>
                <li>Check eligibility status</li>
                <li>Get emergency alerts</li>
              </ul>
            </div>
            <div className="system-module-card">
              <div className="system-module-card__title">Blood Bank Module</div>
              <div className="system-module-card__subtitle">For inventory managers</div>
              <ul className="system-module-card__list">
                <li>Real-time inventory tracking</li>
                <li>Blood request management</li>
                <li>Donor database management</li>
                <li>Expiry & stock reports</li>
              </ul>
            </div>
            <div className="system-module-card">
              <div className="system-module-card__title">Hospital Module</div>
              <div className="system-module-card__subtitle">For healthcare providers</div>
              <ul className="system-module-card__list">
                <li>Search blood availability</li>
                <li>Submit urgent requests</li>
                <li>Track request status</li>
                <li>Manage hospital profile</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="how-it-works__container">
          <h2 className="how-it-works__heading">How It Works</h2>
          <p className="how-it-works__subheading">Three simple steps to save a life</p>
          <div className="how-it-works__steps">
            <div className="how-step">
              <div className="how-step__icon"><span className="how-step__icon-img how-step__icon--user"></span><span className="how-step__badge">1</span></div>
              <div className="how-step__title">Register & Donate</div>
              <div className="how-step__desc">Donors register and schedule appointments to donate blood safely.</div>
            </div>
            <div className="how-step">
              <div className="how-step__icon"><span className="how-step__icon-img how-step__icon--bank"></span><span className="how-step__badge">2</span></div>
              <div className="how-step__title">Store & Manage</div>
              <div className="how-step__desc">Blood banks receive, test, and store units in their digital inventory.</div>
            </div>
            <div className="how-step">
              <div className="how-step__icon"><span className="how-step__icon-img how-step__icon--search"></span><span className="how-step__badge">3</span></div>
              <div className="how-step__title">Search & Request</div>
              <div className="how-step__desc">Patients and hospitals search for required groups and submit requests.</div>
            </div>
            <div className="how-step">
              <div className="how-step__icon"><span className="how-step__icon-img how-step__icon--heart"></span><span className="how-step__badge">4</span></div>
              <div className="how-step__title">Issue & Save</div>
              <div className="how-step__desc">Approved requests are fulfilled, and blood is issued to save lives.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="donate-info-section">
        <div className="donate-info__container">
          <div className="donate-info__left">
            <h2 className="donate-info__heading">Why Donate Blood?</h2>
            <ul className="donate-info__list">
              <li><span className="donate-info__icon donate-info__icon--check"></span><span className="donate-info__list-title">Saves Lives</span><span className="donate-info__list-desc">A single donation can save up to three lives in emergency situations.</span></li>
              <li><span className="donate-info__icon donate-info__icon--check"></span><span className="donate-info__list-title">Safe & Simple</span><span className="donate-info__list-desc">The process is quick, strictly regulated, and performed by professionals.</span></li>
              <li><span className="donate-info__icon donate-info__icon--check"></span><span className="donate-info__list-title">Community Impact</span><span className="donate-info__list-desc">Your contribution strengthens the local healthcare system for everyone.</span></li>
            </ul>
          </div>
          <div className="donate-info__right">
            <div className="donate-eligibility-box">
              <h3 className="donate-eligibility__heading">Who Can Donate?</h3>
              <ul className="donate-eligibility__list">
                <li><span className="donate-eligibility__dot"></span>Age: 18 - 65 years old</li>
                <li><span className="donate-eligibility__dot"></span>Weight: At least 50kg (110 lbs)</li>
                <li><span className="donate-eligibility__dot"></span>Health: In good general health at the time of donation</li>
                <li><span className="donate-eligibility__dot"></span>Gap: 90 days since your last donation</li>
              </ul>
              <div className="donate-eligibility__note"><b>Note:</b> Always consult with our medical team on-site for a final eligibility check.</div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Home;