import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./ShowDoctorList.css";

const ShowDoctorList = ({ onScheduleAppointment }) => {
  const [doctors, setDoctors] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientId, setPatientId] = useState(""); // New state to store patientId
  const navigate = useNavigate(); // Use the navigate hook for redirection

  useEffect(() => {
    // Fetch patientId from localStorage
    const storedPatientId = localStorage.getItem("patientId");
    if (storedPatientId) {
      setPatientId(storedPatientId);
    } else {
      console.error("Patient ID not found in localStorage.");
    }
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:8000/doctor/getAllDoctors");
        setDoctors(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await axios.get("http://localhost:8000/availability/getAll");
        setAvailability(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const mergedData = doctors.map((doctor) => {
    const doctorAvailability = availability.filter((a) => a.doctorId === doctor.doctorId);
    return { ...doctor, availability: doctorAvailability };
  });

  const handleScheduleAppointment = (doctorId) => {
    navigate(`/schedule-appointment/${doctorId}`); // Redirect to the schedule appointment page
  };

  return (
    <div className="doctor-list-container">
      {mergedData.length > 0 ? (
        mergedData.map((doctor) => (
          <div key={doctor.doctorId} className="doctor-card">
            <h2>{doctor.doctorName}</h2>
            <p>Speciality: {doctor.speciality}</p>
            <p>Location: {doctor.location}</p>
            <p>Experience: {doctor.experience}</p>
            <p>Mobile No: {doctor.mobileNo}</p>
            <p>Email: {doctor.email}</p>
            <div>
              <h3>Availability:</h3>
              {doctor.availability.length > 0 ? (
                doctor.availability.map((avail) => (
                  <div key={avail.availabilityId}>
                    <p>Start Date: {avail.startDate}</p>
                    <p>End Date: {avail.endDate}</p>
                  </div>
                ))
              ) : (
                <p>No availability listed</p>
              )}
            </div>
            <button
              onClick={() => handleScheduleAppointment(doctor.doctorId)} // Use handleScheduleAppointment
              className="schedule-button"
            >
              Schedule Appointment
            </button>
          </div>
        ))
      ) : (
        <p>No doctors available</p>
      )}
    </div>
  );
};

export default ShowDoctorList;
