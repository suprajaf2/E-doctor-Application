import axios from "axios";
import React, { useState, useEffect } from "react";
import "./PatientDashboard.css";
import PatientProfile from "./PatientProfile";
import ShowDoctorList from "./ShowDoctorList";
import AppointmentHistory from "./AppointmentHistory";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faUser,
  faClock,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [currentPatientId, setCurrentPatientId] = useState("");
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const storedPatientId = localStorage.getItem("patientId");
    if (storedPatientId) {
      setCurrentPatientId(storedPatientId);
    } else {
      console.error("Patient ID not found in localStorage.");
    }

    const storedUserId =
      localStorage.getItem("userId") || sessionStorage.getItem("userId");
    if (storedUserId) {
      fetchProfileData(storedUserId);
    }
  }, []);

  const fetchProfileData = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/patient/getPatientByEmail?email=${userId}`
      );
      if (response.data) {
        setProfileData(response.data);
      } else {
        setProfileData(null);
        setActiveTab("PatientProfile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfileData(null);
      setActiveTab("PatientProfile");
    }
  };

  const handleLogout = () => {
    alert("Logged out successfully!");
    window.location.href = "/login";
  };

  const handleScheduleAppointment = (doctorId, patientId) => {
    setSelectedDoctorId(doctorId);
    setActiveTab("ShowDoctorList");
  };

  const tabs = [
    { name: "Dashboard", icon: faUser, color: "#007BFF" },
    { name: "PatientProfile", icon: faUser, color: "#6C757D" },
    { name: "ShowDoctorList", icon: faCalendarAlt, color: "#17A2B8" },
    { name: "AppointmentHistory", icon: faCalendarAlt, color: "#FFC107" },
  ];

  return (
    <div className="dashboard-container" style={{ overflowY: "scroll" }}>
      {/* Sidebar */}
      <div className="sidebar">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={activeTab === tab.name ? "active" : ""}
          >
            <FontAwesomeIcon icon={tab.icon} style={{ color: tab.color }} />
            {tab.name}
          </button>
        ))}
        <button className="logout-button" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} style={{ color: "#DC3545" }} />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1 className="dashboard-heading">Welcome to Patient Dashboard</h1>

        {/* Dashboard Information */}
        {activeTab === "Dashboard" && (
          <div className="dashboard-content">
            <div className="dashboard-box" style={{ backgroundColor: "#4CAF50" }}>
              <FontAwesomeIcon icon={faCalendarAlt} size="2x" style={{ color: "white" }} />
              <h3 style={{ color: "black" }}>Upcoming Appointments</h3>
              <p>2</p>
            </div>

            <div className="dashboard-box" style={{ backgroundColor: "#f44336" }}>
              <FontAwesomeIcon icon={faCalendarAlt} size="2x" style={{ color: "white" }} />
              <h3 style={{ color: "black" }}>Canceled Appointments</h3>
              <p>1</p>
            </div>

            <div className="dashboard-box" style={{ backgroundColor: "#2196F3" }}>
              <FontAwesomeIcon icon={faCalendarAlt} size="2x" style={{ color: "white" }} />
              <h3 style={{ color: "black" }}>Completed Appointments</h3>
              <p>5</p>
            </div>
          </div>
        )}

        {/* Dynamic Content Rendering Based on Active Tab */}
        {activeTab === "PatientProfile" && <PatientProfile />}
        {activeTab === "ShowDoctorList" && (
          <ShowDoctorList onScheduleAppointment={handleScheduleAppointment} />
        )}
        {activeTab === "AppointmentHistory" && <AppointmentHistory />}
      </div>
    </div>
  );
};

export default PatientDashboard;
