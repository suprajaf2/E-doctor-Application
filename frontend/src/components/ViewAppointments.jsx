import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewAppointments.css";

const ViewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedDoctorId = localStorage.getItem("doctorId");
    if (storedDoctorId) {
      setDoctorId(storedDoctorId);
      fetchDoctorProfile(storedDoctorId);
    } else {
      alert("Doctor ID not found. Please ensure you are logged in.");
    }
  }, []);

  const fetchDoctorProfile = async (doctorId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/admin/doctor-profile?doctorId=${doctorId}`
      );
      setProfileData(response.data);
    } catch (error) {
      console.error("Error fetching doctor profile:", error.message);
    }
  };

  const fetchAppointments = async () => {
    if (!date || !doctorId) {
      alert("Please provide both date and doctor ID.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/admin/patients?date=${date}&doctorId=${doctorId}`
      );
      setAppointments(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching appointments:", error.message);
      setError("Failed to fetch appointments. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostStatus = async (appointmentId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/doctor/updateAppointmentStatus?appointmentId=${appointmentId}&status=${status}`
      );
      setResponseMessage(`Appointment ${status.toLowerCase()} successfully.`);
      setError("");
      fetchAppointments();
    } catch (error) {
      console.error("Error updating status:", error.message);
      setError("Failed to update appointment status. Please try again.");
      setResponseMessage("");
    }
  };

  const handleStatusChange = (appointmentId, e) => {
    const status = e.target.value;
    if (status) {
      handlePostStatus(appointmentId, status);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchAppointments();
  };

  return (
    <div className="view-appointments">
      {profileData && (
        <div className="profile-section">
          <h3>Doctor Profile</h3>
          <table>
            <tbody>
              <tr>
                <td><strong>Name</strong></td>
                <td>{profileData.doctorName}</td>
              </tr>
              <tr>
                <td><strong>Specialization</strong></td>
                <td>{profileData.speciality}</td>
              </tr>
              <tr>
                <td><strong>Doctor ID</strong></td>
                <td>{profileData.doctorId}</td>
              </tr>
              <tr>
                <td><strong>Location</strong></td>
                <td>{profileData.location}</td>
              </tr>
              <tr>
                <td><strong>Mobile No</strong></td>
                <td>{profileData.mobileNo}</td>
              </tr>
              <tr>
                <td><strong>Email</strong></td>
                <td>{profileData.email}</td>
              </tr>
              <tr>
                <td><strong>Experience</strong></td>
                <td>{profileData.experience}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <h2>Appointments</h2>
      <form onSubmit={handleSubmit} className="form1">
        <div>
          <label>
            Date:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Doctor ID:
            <input
              type="text"
              value={doctorId}
              readOnly
            />
          </label>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Fetch Appointments"}
        </button>
      </form>

      {appointments.length === 0 ? (
        <p style={{ textAlign: "center" }}>No appointments available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Name</th>
              <th>Mobile No</th>
              <th>Blood Group</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Address</th>
              <th>Appointment Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.appointmentId}>
                <td>{appt.patientId}</td>
                <td>{appt.patientName}</td>
                <td>{appt.mobileNo}</td>
                <td>{appt.bloodGroup}</td>
                <td>{appt.gender}</td>
                <td>{appt.age}</td>
                <td>{appt.address}</td>
                <td>{appt.appointmentStatus}</td>
                <td>
                  {appt.appointmentStatus === "Pending" && (
                    <select
                      onChange={(e) => handleStatusChange(appt.appointmentId, e)}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Update Status
                      </option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {responseMessage && (
        <p style={{ color: "green", textAlign: "center" }}>{responseMessage}</p>
      )}
      {error && (
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      )}
    </div>
  );
};

export default ViewAppointments;
