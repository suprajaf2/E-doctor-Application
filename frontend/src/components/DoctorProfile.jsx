import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DoctorProfile.css";

const DoctorProfile = () => {
  const [profileData, setProfileData] = useState(null); // Profile data fetched from the backend
  const [formData, setFormData] = useState({
    doctorId: "",
    doctorName: "",
    speciality: "",
    location: "",
    mobileNo: "",
    experience: "",
    email: "", // Email field directly tied to userId
  });
  const [userId, setUserId] = useState(""); // User ID retrieved from storage
  const [error, setError] = useState(""); // Error message for fetching or saving data

  // Fetch userId from localStorage or sessionStorage
  useEffect(() => {
    const storedUserId =
      localStorage.getItem("userId") || sessionStorage.getItem("userId");

    if (storedUserId) {
      setUserId(storedUserId);
      console.log("User ID retrieved:", storedUserId);

      // Set email in formData
      setFormData((prevData) => ({
        ...prevData,
        email: storedUserId, // Bind the stored email as the email field
      }));
    } else {
      setError("User ID not found. Please log in.");
    }
  }, []);

  // Fetch profile data from the backend using email (userId)
  useEffect(() => {
    if (!userId) return;
  
    const fetchDoctorData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/doctor/getDoctorByEmail?email=${userId}`
        );
  
        if (response.data) {
          const doctorId = response.data.doctorId || "";
          localStorage.setItem("doctorId", doctorId); // Save doctorId in localStorage
          setProfileData(response.data);
  
          setFormData({
            doctorId,
            doctorName: response.data.doctorName || "",
            speciality: response.data.speciality || "",
            location: response.data.location || "",
            mobileNo: response.data.mobileNo || "",
            experience: response.data.experience || "",
            email: response.data.email || "",
          });
        } else {
          setError("No doctor found with this email.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
       // setError("Error fetching profile. Please try again later.");
      }
    };
  
    fetchDoctorData();
  }, [userId]);
  

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    //e.preventDefault(); // Prevent page reload
    try {
      const response = await axios.post(
        "http://localhost:8000/doctor/addDoctor",
        {
          ...formData,
          users: { email: formData.email }, // Adjust payload for nested email
        }
      );
      setProfileData(response.data);
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      setError("Error saving profile. Please try again.");
    }
  };

  return (
    <div className="doctorProfile">
      <h2>{profileData ? "Edit Doctor Profile" : "Create Doctor Profile"}</h2>

      {error && <p className="error">{error}</p>}

      {/* Show form if no profile data is available */}
      {!profileData && (
        <form onSubmit={handleSubmit}>
          <input
            name="doctorName"
            placeholder="Name"
            value={formData.doctorName}
            onChange={handleChange}
            required
          />
          <input
            name="doctorId"
            placeholder="Doctor ID"
            value={formData.doctorId}
            onChange={handleChange}
            required
          />
          <input
            name="speciality"
            placeholder="Specialization"
            value={formData.speciality}
            onChange={handleChange}
            required
          />
          <input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <input
            name="mobileNo"
            placeholder="Mobile No"
            value={formData.mobileNo}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            placeholder="Email"
            value={formData.email} // Email tied to userId
            onChange={handleChange}
            readOnly // Email field should be read-only since it comes from storage
          />
          <input
            name="experience"
            placeholder="Experience"
            value={formData.experience}
            onChange={handleChange}
            required
          />
          <button type="submit">Save Profile</button>
        </form>
      )}

      {/* Show profile card if profile data is available */}
      {profileData && (
        <div>
          <h3>Doctor Profile</h3>
          <p><strong>Name:</strong> {profileData.doctorName}</p>
          <p><strong>Specialization:</strong> {profileData.speciality}</p>
          <p><strong>Doctor ID:</strong> {profileData.doctorId}</p>
          <p><strong>Location:</strong> {profileData.location}</p>
          <p><strong>Mobile No:</strong> {profileData.mobileNo}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Experience:</strong> {profileData.experience}</p>
        </div>
      )}
    </div>
  );
};

export default DoctorProfile;
