import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FeedbackListAdmin.css";

const FeedbackListAdmin = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctorId, setDoctorId] = useState(""); // State to hold doctorId

  // Helper function to render stars
  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  // Fetch feedback based on doctorId from the server
  const fetchFeedback = async () => {
    if (!doctorId) return; // Don't fetch if doctorId is not provided

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

  // Delete feedback
  const deleteFeedback = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/feedback/${id}`);
      setFeedbackList(feedbackList.filter((feedback) => feedback.id !== id));
    } catch (error) {
      console.error("Error deleting feedback:", error);
      setError("Failed to delete feedback. Please try again later.");
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [doctorId]); // Fetch feedback whenever doctorId changes

  // Calculate average rating
  const averageRating =
    feedbackList.length > 0
      ? (
          feedbackList.reduce((sum, feedback) => sum + feedback.rating, 0) / 
          feedbackList.length
        ).toFixed(1)
      : null;

  return (
    <div className="feedback-list-admin-container">
      <h2>Admin Feedback Management</h2>
      
      {/* Input to enter doctorId */}
      <div>
        <input
          type="text"
          placeholder="Enter Doctor ID"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
        />
        <button onClick={fetchFeedback} disabled={!doctorId}>
          Load Feedback
        </button>
      </div>

      {loading ? (
        <p>Loading feedback...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : feedbackList.length > 0 ? (
        <>
          <div className="average-rating">
            <h3>
              Average Rating: {averageRating}{" "}
              <span style={{ color: "gold" }}>
                {renderStars(Math.round(averageRating))}
              </span>
            </h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Feedback ID</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Feedback Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbackList.map((feedback) => (
                <tr key={feedback.id}>
                  <td>{feedback.id}</td>
                  <td style={{ color: "gold" }}>
                    {renderStars(feedback.rating)}
                  </td>
                  <td>{feedback.comment}</td>
                  <td>{new Date(feedback.feedbackDate).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => deleteFeedback(feedback.id)}
                      style={{ color: "red" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>No feedback available for this doctor.</p>
      )}
    </div>
  );
};

export default FeedbackListAdmin;
