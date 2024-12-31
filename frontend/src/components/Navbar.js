// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Navbar styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStethoscope, faHome, faInfoCircle, faPhone, faSignInAlt, faUserPlus, faUserTie } from '@fortawesome/free-solid-svg-icons'; // Correct import for faUserTie

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FontAwesomeIcon icon={faStethoscope} className="navbar-logo-icon" />
          DoctorApp
        </Link>
        <ul className="navbar-links">
          <li>
            <Link to="/">
              <FontAwesomeIcon icon={faHome} className="navbar-icon" />
              Home
            </Link>
          </li>
          <li>
            <Link to="/about">
              <FontAwesomeIcon icon={faInfoCircle} className="navbar-icon" />
              About
            </Link>
          </li>
          <li>
            <Link to="/contact">
              <FontAwesomeIcon icon={faPhone} className="navbar-icon" />
              Contact
            </Link>
          </li>
          <li>
            <Link to="/login">
              <FontAwesomeIcon icon={faSignInAlt} className="navbar-icon" />
              Login
            </Link>
          </li>
          <li>
            <Link to="/register">
              <FontAwesomeIcon icon={faUserPlus} className="navbar-icon" />
              Register
            </Link>
          </li>
          <li>
            <Link to="/adminLogin">
              <FontAwesomeIcon icon={faUserTie} className="navbar-icon" />
              Admin
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
