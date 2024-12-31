import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AppointmentHistory.css";

const AppointmentHistory = () => {
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointmentHistory = async () => {
      const patientId = localStorage.getItem("patientId");

      if (!patientId) {
        setError("Patient ID not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/appointments/patient?patientId=${patientId}`
        );

        if (Array.isArray(response.data)) {
          const appointments = await Promise.all(
            response.data.map(async (appointment) => {
              try {
                const doctorResponse = await axios.get(
                  `http://localhost:8000/doctor/getDoctor/${appointment.doctorId}`
                );
                return {
                  ...appointment,
                  doctorName: doctorResponse.data.doctorName || "Unknown",
                };
              } catch (err) {
                console.error(
                  `Error fetching doctor details for doctorId ${appointment.doctorId}:`,
                  err
                );
                return {
                  ...appointment,
                  doctorName: "Unknown",
                };
              }
            })
          );
          setAppointmentHistory(appointments);
        } else {
          setError("Unexpected API response format.");
        }
      } catch (err) {
        console.error("Error fetching appointment history:", err);
        setError("Failed to fetch appointment history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentHistory();
  }, []);

  const handleRedirect = (path, data) => {
    navigate(path, { state: data });
  };

  return (
    <div className="appointment-history-container">
      <h2>Appointment History</h2>
      <div className="appointment-history-table">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <table className="appointment-table">
            <thead>
              <tr>
                <th>Appointment ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Remark</th>
                <th>Doctor Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointmentHistory.length > 0 ? (
                appointmentHistory.map((appointment) => (
                  <tr key={appointment.appointmentId}>
                    <td>{appointment.appointmentId || "N/A"}</td>
                    <td>{appointment.appointmentDate || "N/A"}</td>
                    <td>{appointment.appointmentStatus || "N/A"}</td>
                    <td>{appointment.remark || "N/A"}</td>
                    <td>{appointment.doctorName || "Unknown"}</td>
                    <td>
                      {appointment.appointmentStatus === "Scheduled" && (
                        <div className="actions">
                          <button
                            className="action-button"
                            onClick={() =>
                              handleRedirect("/Payment", {
                                appointmentId: appointment.appointmentId,
                                amount: appointment.amount || 1000, // Default amount
                              })
                            }
                          >
                            Pay Now
                          </button>
                        </div>
                      )}
                      {appointment.appointmentStatus === "Scheduled And Paid" && (
                        <div className="actions">
                          <button
                            className="action-button"
                            onClick={() =>
                              handleRedirect("/Feedback", {
                                doctorId: appointment.doctorId,
                                patientId: appointment.patientId,
                                appointmentId: appointment.appointmentId,
                              })
                            }
                          >
                            Provide Feedback
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-appointments">
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AppointmentHistory;
