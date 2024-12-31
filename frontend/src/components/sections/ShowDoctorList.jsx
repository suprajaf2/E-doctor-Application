// ShowDoctorList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ShowDoctorList.css";

const ShowDoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [doctorError, setDoctorError] = useState(null);
  const [doctorAvailability, setDoctorAvailability] = useState({});

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:8000/doctor/getAllDoctors");
        if (Array.isArray(response.data)) {
          setDoctors(response.data);
        } else {
          console.error("Unexpected API response: ", response.data);
          setDoctors([]);
        }
      } catch (error) {
        console.error("Error fetching doctors: ", error);
        setDoctorError("Failed to fetch doctor list. Please try again later.");
      } finally {
        setDoctorLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const fetchDoctorAvailability = async (doctorId) => {
    try {
      const response = await axios.get(`http://localhost:8000/getByDoctor/${doctorId}`);
      setDoctorAvailability((prevAvailability) => ({
        ...prevAvailability,
        [doctorId]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching doctor availability:", error);
    }
  };

  return (
    <div className="doctor-list-container">
      <h2>Doctor List</h2>
      {doctorLoading ? (
        <p>Loading doctors...</p>
      ) : doctorError ? (
        <p>Error: {doctorError}</p>
      ) : doctors.length > 0 ? (
        doctors.map((doctor) => (
          <div
            key={doctor.doctorId}
            className="doctor-card"
            onMouseEnter={() => fetchDoctorAvailability(doctor.doctorId)}
          >
            <h3>{doctor.doctorName}</h3>
            <p><strong>Speciality:</strong> {doctor.speciality}</p>
            <p><strong>Location:</strong> {doctor.location}</p>
            <p><strong>Mobile No:</strong> {doctor.mobileNo}</p>
            <p><strong>Email:</strong> {doctor.email}</p>
            <p><strong>Experience:</strong> {doctor.experience} years</p>
            {doctorAvailability[doctor.doctorId] && (
              <>
                <p><strong>Start Date:</strong> {doctorAvailability[doctor.doctorId].startDate}</p>
                <p><strong>End Date:</strong> {doctorAvailability[doctor.doctorId].endDate}</p>
              </>
            )}
            <button>Schedule Appointment</button>
          </div>
        ))
      ) : (
        <p>No doctors available.</p>
      )}
    </div>
  );
};

export default ShowDoctorList;
