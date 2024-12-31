import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false); // Track if OTP is sent
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:8000/forgot-password', null, {
        params: { email },
      });
      setMessage('OTP has been sent to your email.');
      setIsOtpSent(true); // OTP sent successfully
      console.log("API response:", response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message); // Backend error message
      } else {
        setMessage('An error occurred while sending OTP.');
      }
      console.error('Error during OTP request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:8000/reset-password', null, {
        params: { otp, newPassword },
      });
      setMessage('Password reset successful! Redirecting to login...');
      console.log("API response:", response.data);

      setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message); // Backend error message
      } else {
        setMessage('An error occurred during password reset.');
      }
      console.error('Error during password reset:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <form className="forgot-password-form" onSubmit={isOtpSent ? handleResetPassword : handleSendOtp}>
        <h2>{isOtpSent ? 'Reset Password' : 'Forgot Password'}</h2>
        {message && <p className="message">{message}</p>}

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {isOtpSent && (
          <>
            <label htmlFor="otp">Enter OTP</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </>
        )}

        <button type="submit" disabled={isLoading}>
          {isLoading ? (isOtpSent ? 'Resetting...' : 'Sending OTP...') : (isOtpSent ? 'Reset Password' : 'Send OTP')}
        </button>

        <p>
          Remember your password? <a href="/login">Login here</a>
        </p>
      </form>
    </div>
  );
}

export default ForgotPassword;
