import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Payment = () => {
  const location = useLocation();
  const [paymentDetails, setPaymentDetails] = useState({
    appointmentId: '',
    amount: '1000', // Default amount
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.appointmentId) {
      setPaymentDetails((prev) => ({
        ...prev,
        appointmentId: location.state.appointmentId,
      }));
    }
  }, [location.state]);

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:8000/api/payment/create-checkout-session', {
        appointmentId: parseInt(paymentDetails.appointmentId, 10),
        amount: parseFloat(paymentDetails.amount),
      });

      const sessionUrl = response.data.sessionUrl;
      window.location.href = sessionUrl;
    } catch (err) {
      setError(
        err.response?.data?.message || 'An error occurred while creating the checkout session.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: 'auto',
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h5" component="h2" align="center" gutterBottom>
        Pay for Appointment
      </Typography>
      <TextField
        label="Appointment ID"
        name="appointmentId"
        type="text"
        value={paymentDetails.appointmentId}
        fullWidth
        InputProps={{
          readOnly: true, // Make the field read-only
        }}
      />
      <TextField
        label="Amount"
        name="amount"
        type="number"
        value={paymentDetails.amount}
        fullWidth
        InputProps={{
          readOnly: true, // Make the field read-only
        }}
      />
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handlePayment}
        fullWidth
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </Button>
    </Box>
  );
};

export default Payment;