import React, { useState, useEffect } from 'react';
import './FeedbackList.css';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching feedback data from an API or mock endpoint
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        // Replace this with your actual API endpoint
        const response = await fetch('/api/feedbacks');
        const data = await response.json();
        setFeedbacks(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching feedback data:', error);
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="feedback-list-container">
      <h2>Feedback List</h2>

      {loading ? (
        <p>Loading feedback data...</p>
      ) : (
        <table className="feedback-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient Name</th>
              <th>Doctor Name</th>
              <th>Feedback</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback) => (
              <tr key={feedback.id}>
                <td>{feedback.id}</td>
                <td>{feedback.patientName}</td>
                <td>{feedback.doctorName}</td>
                <td>{feedback.comment}</td>
                <td>{feedback.rating}/5</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FeedbackList;
