import React, { useEffect, useState } from 'react';
import './PatientList.css';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPatient, setEditingPatient] = useState(null);
  const [updatedPatient, setUpdatedPatient] = useState({});

  // Fetching data from the API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('http://localhost:8000/admin/getAllPatients');
        const data = await response.json();
        setPatients(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching patient data:', error);
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleDelete = async (patientId) => {
    try {
      const response = await fetch(`http://localhost:8000/admin/deletePatient/${patientId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setPatients((prevPatients) => prevPatients.filter((patient) => patient.patientId !== patientId));
      } else {
        console.error('Error deleting patient');
      }
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient.patientId);
    setUpdatedPatient(patient);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/admin/updatePatient`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPatient),
      });
      if (response.ok) {
        setPatients((prevPatients) =>
          prevPatients.map((patient) =>
            patient.patientId === editingPatient ? updatedPatient : patient
          )
        );
        setEditingPatient(null);
      } else {
        console.error('Error updating patient');
      }
    } catch (error) {
      console.error('Error updating patient:', error);
    }
  };

  return (
    <div className="patient-list-container">
      <h2>Patient List</h2>

      {loading ? (
        <p>Loading patient data...</p>
      ) : (
        <table className="patient-table">
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Patient Name</th>
              <th>Mobile No</th>
              <th>Blood Group</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Address</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.length > 0 ? (
              patients.map((patient) => (
                <tr key={patient.patientId}>
                  {editingPatient === patient.patientId ? (
                    <>
                      <td>{patient.patientId}</td>
                      <td>
                        <input
                          type="text"
                          name="patientName"
                          value={updatedPatient.patientName || ''}
                          onChange={handleUpdateChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="mobileNo"
                          value={updatedPatient.mobileNo || ''}
                          onChange={handleUpdateChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="bloodGroup"
                          value={updatedPatient.bloodGroup || ''}
                          onChange={handleUpdateChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="gender"
                          value={updatedPatient.gender || ''}
                          onChange={handleUpdateChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="age"
                          value={updatedPatient.age || ''}
                          onChange={handleUpdateChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="address"
                          value={updatedPatient.address || ''}
                          onChange={handleUpdateChange}
                        />
                      </td>
                      <td>
                        <input
                          type="email"
                          name="email"
                          value={updatedPatient.email || ''}
                          onChange={handleUpdateChange}
                        />
                      </td>
                      <td>
                        <button className="save-btn" onClick={handleUpdateSubmit}>
                          Save
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => setEditingPatient(null)}
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{patient.patientId}</td>
                      <td>{patient.patientName}</td>
                      <td>{patient.mobileNo}</td>
                      <td>{patient.bloodGroup}</td>
                      <td>{patient.gender}</td>
                      <td>{patient.age}</td>
                      <td>{patient.address}</td>
                      <td>{patient.email}</td>
                      <td>
                        <button className="edit-btn" onClick={() => handleEdit(patient)}>
                          Edit
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(patient.patientId)}>
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', color: '#888' }}>
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientList;
