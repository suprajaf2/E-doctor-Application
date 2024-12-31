import React, { useState, useEffect } from "react";
import "./DoctorList.css";

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [updatedDoctor, setUpdatedDoctor] = useState({});

  // Fetch all doctors from the API
  useEffect(() => {
    fetch("http://localhost:8000/admin/getAllDoctors")
      .then((response) => response.json())
      .then((data) => {
        setDoctors(data);
      })
      .catch((error) => console.error("Error fetching doctors:", error));
  }, []);

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor.doctorId);
    setUpdatedDoctor(doctor);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDoctor((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/admin/updateDoctor`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDoctor),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setDoctors((prevDoctors) =>
          prevDoctors.map((doctor) =>
            doctor.doctorId === updatedData.doctorId ? updatedData : doctor
          )
        );
        setEditingDoctor(null);
      } else {
        console.error("Error updating doctor");
      }
    } catch (error) {
      console.error("Error updating doctor:", error);
    }
  };

  const handleDelete = async (doctorId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/admin/deleteDoctor/${doctorId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setDoctors((prevDoctors) =>
          prevDoctors.filter((doctor) => doctor.doctorId !== doctorId)
        );
      } else {
        console.error("Error deleting doctor");
      }
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  return (
    <div className="doctor-container">
      <h2>Doctor Management</h2>

      <div className="doctor-table">
        <h3>List of Doctors</h3>
        <table>
          <thead>
            <tr>
              <th>Doctor ID</th>
              <th>Doctor Name</th>
              <th>Speciality</th>
              <th>Location</th>
              <th>Experience</th>
              <th>Mobile No</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
                <tr key={doctor.doctorId}>
                  {editingDoctor === doctor.doctorId ? (
                    <>
                      <td>{doctor.doctorId}</td>
                      <td>
                        <input
                          type="text"
                          name="doctorName"
                          value={updatedDoctor.doctorName || ""}
                          onChange={handleUpdateChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="speciality"
                          value={updatedDoctor.speciality || ""}
                          onChange={handleUpdateChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="location"
                          value={updatedDoctor.location || ""}
                          onChange={handleUpdateChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="experience"
                          value={updatedDoctor.experience || ""}
                          onChange={handleUpdateChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="mobileNo"
                          value={updatedDoctor.mobileNo || ""}
                          onChange={handleUpdateChange}
                        />
                      </td>
                      <td>
                        <input
                          type="email"
                          name="email"
                          value={updatedDoctor.email || ""}
                          onChange={handleUpdateChange}
                        />
                      </td>
                      <td>
                        <button
                          className="save-btn"
                          onClick={handleUpdateSubmit}
                        >
                          Save
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => setEditingDoctor(null)}
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{doctor.doctorId}</td>
                      <td>{doctor.doctorName}</td>
                      <td>{doctor.speciality}</td>
                      <td>{doctor.location}</td>
                      <td>{doctor.experience}</td>
                      <td>{doctor.mobileNo}</td>
                      <td>{doctor.email}</td>
                      <td>
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(doctor)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(doctor.doctorId)}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", color: "#888" }}>
                  No doctors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DoctorList;
