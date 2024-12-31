import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { FaStar, FaRegStar } from "react-icons/fa";
import "./Feedback.css";

const Feedback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    doctorId: initDoctorId,
    patientId: initPatientId,
    appointmentId: initAppointmentId,
    returnPath,
  } = location.state || {};

  const [doctorId] = useState(initDoctorId || "");
  const [patientId] = useState(initPatientId || "");
  const [appointmentId] = useState(initAppointmentId || "");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddFeedback = async () => {
    if (!comment || rating === 0) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:8000/feedback", {
        comment,
        patientId,
        doctorId,
        appointmentId,
        rating,
        feedbackDate: new Date().toISOString(),
      });
      console.log("Feedback Added:", response.data);

      // Clear form inputs
      setComment("");
      setRating(0);

      // Redirect to the return path or default path
      navigate(returnPath || "/PatientDashboard");
    } catch (err) {
      console.error("Error adding feedback:", err.message);
      setError("Feedback Already Filled");
    } finally {
      setLoading(false);
    }
  };

  const renderRatingStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar
            key={i}
            onClick={() => setRating(i)}
            style={{ cursor: "pointer", color: "gold" }}
          />
        ) : (
          <FaRegStar
            key={i}
            onClick={() => setRating(i)}
            style={{ cursor: "pointer", color: "gold" }}
          />
        )
      );
    }
    return stars;
  };

  return (
    <div className="feedback-container">
      <Typography variant="h4">Feedback Management</Typography>
      <div className="feedback-form">
        <TextField
          label="Comment"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="rating-container">
          <Typography>Rating (1-5):</Typography>
          <div>{renderRatingStars()}</div>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddFeedback}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Submit Feedback"}
        </Button>
        {error && <Typography color="error">{error}</Typography>}
      </div>
    </div>
  );
};

export default Feedback;
