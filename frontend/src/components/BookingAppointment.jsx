import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookingAppointment.css";

const BookingAppointment = () => {
  const { doctorId } = useParams(); // Get doctorId from the route
  const [appointments, setAppointments] = useState([]);
  const [appointmentData, setAppointmentData] = useState({
    appointmentDate: "",
    remark: "",
    patientId: "",
    doctorId: doctorId, // Initialize with the passed doctorId
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    // Fetch patientId and doctorId from localStorage
    const storedPatientId = localStorage.getItem("patientId") || sessionStorage.getItem("patientId");
    const storedDoctorId = localStorage.getItem("doctorId") || sessionStorage.getItem("doctorId");
    if (storedPatientId || storedDoctorId) {
      setAppointmentData((prevData) => ({
        ...prevData,
        patientId: storedPatientId || prevData.patientId,
        doctorId: storedDoctorId || prevData.doctorId,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      appointmentDate: appointmentData.appointmentDate,
      appointmentStatus: "Scheduled",
      remark: appointmentData.remark,
      patient: {
        patientId: appointmentData.patientId,
      },
      doctor: {
        doctorId: appointmentData.doctorId,
      },
    };

    try {
      const response = await axios.post("http://localhost:8000/appointments", payload);
      setAppointments([...appointments, response.data]);
      setSuccess("Appointment booked successfully!Redirecting to PatientDashboard");
      setError("");
      setAppointmentData({
        appointmentDate: "",
        remark: "",
        patientId: appointmentData.patientId,
        doctorId: doctorId,
      });

      // Navigate back to the previous page after a 3-second delay
      setTimeout(() => {
        navigate(-1); // -1 means go back to the previous route
      }, 3000);
    } catch (error) {
      console.error("Error booking appointment:", error);
      setError("Failed to book appointment. Please try again.");
    }
  };


  const storeInStorage = () => {
    localStorage.setItem("patientId", appointmentData.patientId);
    localStorage.setItem("doctorId", appointmentData.doctorId);
    console.log("Stored in localStorage:", {
      patientId: appointmentData.patientId,
      doctorId: appointmentData.doctorId,
    });
  };

  useEffect(() => {
    storeInStorage();
  }, [appointmentData.patientId, appointmentData.doctorId]);

  return (
    <div className="booking-container">
      <h3>Book Appointment</h3>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit} className="booking-form">
        <label>
          Patient ID:
          <input
            type="text"
            name="patientId"
            value={appointmentData.patientId}
            onChange={handleChange}
            required
            readOnly
          />
        </label>
        <label>
          Doctor ID:
          <input
            type="text"
            name="doctorId"
            value={appointmentData.doctorId}
            onChange={handleChange}
            required
            readOnly
          />
        </label>
        <label>
          Appointment Date:
          <input
            type="date"
            name="appointmentDate"
            value={appointmentData.appointmentDate}
            onChange={handleChange}
            required
          />
        </label>
  

        <label>
          Remark:
          <textarea
            name="remark"
            value={appointmentData.remark}
            onChange={handleChange}
            rows="5"
            placeholder="Add any remarks (optional)"
          />
        </label>
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
};

export default BookingAppointment;
