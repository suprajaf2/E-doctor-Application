import React, { useState, useEffect } from 'react';
import './AppointmentList.css';

function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false); // Toggle form visibility
  const [newAppointment, setNewAppointment] = useState({
    appointmentId: '',
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentStatus: '',
  });

  // Fetch appointments from the API
  useEffect(() => {
    fetch('http://localhost:8000/admin/getAllAppointments')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        return response.json();
      })
      .then((data) => {
        setAppointments(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Handle input changes in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setAppointments((prev) => [...prev, newAppointment]); // Add new appointment locally
    setNewAppointment({
      appointmentId: '',
      patientId: '',
      doctorId: '',
      appointmentDate: '',
      appointmentStatus: '',
    });
    setShowForm(false); // Close the form after submission
  };

  return (
    <div className="appointment-container">
      <h2>Appointments</h2>

      {/* Add Button */}
      <div className="add-button-container">
        <button onClick={() => setShowForm(!showForm)} className="add-button">
          {showForm ? 'Cancel' : 'Add Appointment'}
        </button>
      </div>

      {/* Appointment List Table */}
      <div className="appointment-table">
        <h3>List of Appointments</h3>
        {loading ? (
          <p>Loading appointments...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Appointment ID</th>
                <th>Patient ID</th>
                <th>Doctor ID</th>
                <th>Appointment Date</th>
                <th>Appointment Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr key={appointment.appointmentId}>
                    <td>{appointment.appointmentId}</td>
                    <td>{appointment.patientId}</td>
                    <td>{appointment.doctorId}</td>
                    <td>{appointment.appointmentDate}</td>
                    <td>{appointment.appointmentStatus}</td>
                    <td>
                      <button>Edit</button>
                      <button>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#888' }}>
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Form for Adding New Appointment */}
      {showForm && (
        <div className="add-appointment-form">
          <h3>Add Appointment</h3>
          <form onSubmit={handleSubmit}>
            <label>
              Appointment ID:
              <input
                type="text"
                name="appointmentId"
                value={newAppointment.appointmentId}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Patient ID:
              <input
                type="text"
                name="patientId"
                value={newAppointment.patientId}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Doctor ID:
              <input
                type="text"
                name="doctorId"
                value={newAppointment.doctorId}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Appointment Date:
              <input
                type="date"
                name="appointmentDate"
                value={newAppointment.appointmentDate}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Appointment Status:
              <select
                name="appointmentStatus"
                value={newAppointment.appointmentStatus}
                onChange={handleChange}
                required
              >
                <option value="">Select Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </label>
            <button type="submit">Add Appointment</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AppointmentList;
