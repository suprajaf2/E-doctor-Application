import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faUserDoctor, 
  faUserInjured, 
  faUserShield, 
  faCalendarCheck, 
  faCalendarDay, 
  faComments, 
  faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <nav className="sidebar-nav">
          <ul>
           {/* <li>
              <Link to="/userlist">
                <FontAwesomeIcon icon={faUser} className="nav-icon" />
                User List
              </Link>
            </li> */} 
            <li>
              <Link to="/doctorlist">
                <FontAwesomeIcon icon={faUserDoctor} className="nav-icon" />
                Doctor List
              </Link>
            </li>
            <li>
              <Link to="/patientlist">
                <FontAwesomeIcon icon={faUserInjured} className="nav-icon" />
                Patient List
              </Link>
            </li>
          {/*  <li>
              <Link to="/adminlist">
                <FontAwesomeIcon icon={faUserShield} className="nav-icon" />
                Admin List
              </Link>
            </li> */} 
            <li>
              <Link to="/appointmentlist">
                <FontAwesomeIcon icon={faCalendarCheck} className="nav-icon" />
                Appointments
              </Link>
            </li>
            <li>
              <Link to="/availabilitydates">
                <FontAwesomeIcon icon={faCalendarDay} className="nav-icon" />
                Availability
              </Link>
            </li>
            <li>
              <Link to="/feedbacklist">
                <FontAwesomeIcon icon={faComments} className="nav-icon" />
                Feedback
              </Link>
            </li>
            <li>
              <Link to="/logout" className="logout-link">
                <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="main-header">
          <h1>Welcome, Admin</h1>
          <p>Manage users, appointments, feedback, and more.</p>
        </header>

        <div className="dashboard-overview">
          <div className="overview-card">
            <h3>Users</h3>
            <p>Total: 150</p>
          </div>
          <div className="overview-card">
            <h3>Doctors</h3>
            <p>Total: 50</p>
          </div>
          <div className="overview-card">
            <h3>Patients</h3>
            <p>Total: 300</p>
          </div>
          <div className="overview-card">
            <h3>Feedbacks</h3>
            <p>New: 20</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
