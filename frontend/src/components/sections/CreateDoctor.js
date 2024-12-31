// src/components/CreateDoctor.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateDoctor.css';

function CreateDoctor() {
  const [doctor, setDoctor] = useState({
    doctorId: '',
    doctorName: '',
    speciality: '',
    location: '',
    hospitalName: '',
    mobileNo: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor((prevDoctor) => ({
      ...prevDoctor,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8082/addDoctor', doctor, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Doctor added successfully:', response.data);
      navigate('/doctorlist'); // Redirect to the doctor list page
    } catch (error) {
      console.error('Error adding doctor:', error);
    }
  };

  return (
    <div className="create-doctor">
      <h2>Create Doctor</h2>
      <form onSubmit={handleSubmit} className="doctor-form">
        <label>
          Doctor ID:
          <input
            type="text"
            name="doctorId"
            value={doctor.doctorId}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Name:
          <input
            type="text"
            name="doctorName"
            value={doctor.doctorName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Speciality:
          <input
            type="text"
            name="speciality"
            value={doctor.speciality}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Location:
          <input
            type="text"
            name="location"
            value={doctor.location}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Hospital:
          <input
            type="text"
            name="hospitalName"
            value={doctor.hospitalName}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Phone:
          <input
            type="tel"
            name="mobileNo"
            value={doctor.mobileNo}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={doctor.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={doctor.password}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default CreateDoctor;
