// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';// Ensure the correct path

import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import DoctorList from './components/sections/DoctorList';
import PatientList from './components/sections/PatientList';
import DoctorDashboard from './components/DoctorDashboard';
import PatientDashboard from './components/PatientDashboard';
import ShowDoctorList from './components/ShowDoctorList';
import Navbar from './components/Navbar';
import Home from './components/Home';   
import About from './components/About';  // Ensure the correct path
import Contact from './components/Contact';
import Chatbot from './components/Chatbot';
import AdminLogin from './components/AdminLogin';
import AppointmentList from './components/sections/AppointmentList';
import AvailabilityDates from './components/sections/AvailabilityDates';
import ForgotPassword from './components/ForgotPassword';
import Payment from './components/Payment';
import Feedback from './components/Feedback';
import BookingAppointment from './components/BookingAppointment';
import FeedbackListAdmin from './components/FeedbackListAdmin';
import PatientProfile from './components/PatientProfile';

function App() {
  // State to hold doctor data
  const [doctors, setDoctors] = useState([]);

  // Function to add a new doctor to the list
  const addDoctor = (doctor) => {
    setDoctors((prevDoctors) => [...prevDoctors, doctor]);
  };

  return (
    <Router>
      <Navbar />
      <div className="content">
      <Routes>
      <Route path='/forgotPassword' element={<ForgotPassword/>}/>
        
        <Route path='/appointmentlist' element={<AppointmentList/>}/>
        <Route path='/availabilitydates' element={<AvailabilityDates />}/>
        <Route path="/Login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/doctorlist" element={<DoctorList doctors={doctors} />} />
        <Route path="/schedule-appointment/:doctorId"element={<BookingAppointment />}/>
        <Route path="/feedbacklist"element={<FeedbackListAdmin/>}/>
        <Route path="/patientlist" element={<PatientList doctors={doctors} />} />
        <Route path="/AdminDashboard" element={<AdminDashboard/>} />
        <Route path="/DoctorDashboard" element={<DoctorDashboard />} /> 
        <Route path="/PatientDashboard" element={<PatientDashboard/>} />
        <Route path='/ShowDoctorList' element={<ShowDoctorList />}/>
        <Route path='/Feedback' element={<Feedback/>} />
        <Route path="/PatientDashboard" element={<doctorList />} />
        <Route path="/PatientDashboard" element={<bookAppointment />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/AdminLogin" element={<AdminLogin/>}/>
        <Route path="/payment" element={<Payment />} />
        <Route path='PatientProfile' element={<PatientProfile/>}/>
      </Routes>
      </div>
    </Router>
  );
}


export default App;
