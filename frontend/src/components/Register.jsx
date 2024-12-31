// src/components/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState(''); // Options: 'Patient' or 'Doctor'
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const newUser = { name, email, password, userType };

    try {
      setIsLoading(true); // Start loading
      const response = await axios.post('http://localhost:8000/addUser', newUser);
      setMessage('Registration successful! Redirecting to login...');
      console.log("API response:", response.data);

      setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message); // Backend error message
      } else {
        setMessage('An error occurred during registration.');
      }
      console.error('Error during registration:', error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Register</h2>
        {message && <p className="message">{message}</p>}
        <label htmlFor="name">Username</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{width:"360px",marginLeft:"10px"}}
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <label htmlFor="userType">Role</label>
        <select
          id="userType"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          required
        >
          <option value="">Select Role</option>
          <option value="Patient">Patient</option>
          <option value="Doctor">Doctor</option>
        </select>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
        <p>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </form>
    </div>
  );
}

export default Register;
