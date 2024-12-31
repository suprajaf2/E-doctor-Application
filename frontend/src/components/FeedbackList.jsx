import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FeedbackList.css";

const FeedbackList = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to render stars
  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  useEffect(() => {
    const fetchFeedback = async () => {
      const doctorId = localStorage.getItem("doctorId"); // Retrieve doctorId from localStorage
      if (!doctorId) {
        setError("Doctor ID not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/feedback/doctor/${doctorId}`
        );
        setFeedbackList(response.data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setError("Failed to fetch feedback. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  // Calculate average rating
  const averageRating =
    feedbackList.length > 0
      ? (
          feedbackList.reduce((sum, feedback) => sum + feedback.rating, 0) /
          feedbackList.length
        ).toFixed(1)
      : null;

  return (
    <div className="feedback-list-container">
      <h2>Feedback</h2>
      {loading ? (
        <p>Loading feedback...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : feedbackList.length > 0 ? (
        <>
          <div className="average-rating">
            <h3>
              Average Rating: {averageRating}{" "}
              <span style={{ color: "gold" }}>{renderStars(Math.round(averageRating))}</span>
            </h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Feedback ID</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Feedback Date</th>
              </tr>
            </thead>
            <tbody>
              {feedbackList.map((feedback) => (
                <tr key={feedback.id}>
                  <td>{feedback.id}</td>
                  <td style={{ color: "gold" }}>{renderStars(feedback.rating)}</td>
                  <td>{feedback.comment}</td>
                  <td>{new Date(feedback.feedbackDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>No feedback available.</p>
      )}
    </div>
  );
};

export default FeedbackList;
