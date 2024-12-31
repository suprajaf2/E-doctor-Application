import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AvailabilityForm.css";

const AvailabilityForm = () => {
  const [availabilityData, setAvailabilityData] = useState({
    startDate: "",
    endDate: "",
  });
  const [doctorId, setDoctorId] = useState(""); // Store doctorId separately
  const [error, setError] = useState("");

  // Fetch doctorId from localStorage
  useEffect(() => {
    const storedDoctorId = localStorage.getItem("doctorId");
    console.log("Retrieved Doctor ID from localStorage:", storedDoctorId);

    if (storedDoctorId) {
      setDoctorId(storedDoctorId);
    } else {
      setError("Doctor ID not found. Please log in.");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAvailabilityData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construct the payload with the nested doctor2 object
    const payload = {
      ...availabilityData,
      doctor2: {
        doctorId: doctorId,
      },
    };

    console.log("Data sent to the API:", payload); // Debug the payload structure

    try {
      await axios.post("http://localhost:8000/availability/addAvailability", payload);
      alert("Availability added successfully!");
      setAvailabilityData({
        startDate: "",
        endDate: "",
      });
    } catch (error) {
      console.error("Error adding availability:", error);
    }
  };

  return (
    <div className="availability-form-container">
      <h2>Add/Edit Availability</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          name="startDate"
          value={availabilityData.startDate}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="endDate"
          value={availabilityData.endDate}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AvailabilityForm;
