import React, { useState, useEffect } from 'react';
import './AvailabilityDates.css';

function AvailabilityDates() {
  const [availabilityDates, setAvailabilityDates] = useState([]);
  const [showForm, setShowForm] = useState(false); // To toggle form visibility
  const [newAvailability, setNewAvailability] = useState({
    doctorId: '',
    startDate: '',
    endDate: '',
  });

  // Fetch availability dates on component mount
  useEffect(() => {
    const fetchAvailabilityDates = async () => {
      const response = await fetch('http://localhost:8000/admin/getAllAvailability');
      const data = await response.json();
      setAvailabilityDates(data);
    };
    fetchAvailabilityDates();
  }, []);

  // Handle input changes in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAvailability((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8000/admin/addAvailability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAvailability),
      });

      if (response.ok) {
        const data = await response.json();
        setAvailabilityDates((prev) => [...prev, data]); // Add the new availability to the list
        setNewAvailability({
          doctorId: '',
          startDate: '',
          endDate: '',
        });
        setShowForm(false);
      } else {
        console.error('Error adding availability');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Handle delete action
  const handleDelete = async (availabilityId) => {
    try {
      const response = await fetch(`http://localhost:8000/admin/deleteAvailability/${availabilityId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAvailabilityDates((prev) => prev.filter((item) => item.availabilityId !== availabilityId));
      } else {
        console.error('Error deleting availability');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="availability-container">
      <h2>Availability Dates</h2>

      {/* Add Button */}
      <div className="add-button-container">
        <button onClick={() => setShowForm(!showForm)} className="add-button">
          {showForm ? 'Cancel' : 'Add Availability'}
        </button>
      </div>

      {/* Availability Dates Table */}
      <div className="availability-table">
        <h3>List of Availability Dates</h3>
        <table>
          <thead>
            <tr>
              <th>Availability ID</th>
              <th>Doctor ID</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {availabilityDates.length > 0 ? (
              availabilityDates.map((availability) => (
                <tr key={availability.availabilityId}>
                  <td>{availability.availabilityId}</td>
                  <td>{availability.doctorId}</td>
                  <td>{availability.startDate}</td>
                  <td>{availability.endDate}</td>
                  <td>
                    <button>Edit</button>
                    <button onClick={() => handleDelete(availability.availabilityId)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: '#888' }}>
                  No availability dates added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form for Adding New Availability */}
      {showForm && (
        <div className="add-availability-form">
          <h3>Add Availability</h3>
          <form onSubmit={handleSubmit}>
            <label>
              Doctor ID:
              <input
                type="text"
                name="doctorId"
                value={newAvailability.doctorId}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              From Date:
              <input
                type="date"
                name="startDate"
                value={newAvailability.startDate}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              To Date:
              <input
                type="date"
                name="endDate"
                value={newAvailability.endDate}
                onChange={handleChange}
                required
              />
            </label>
            <button type="submit">Add Availability</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default AvailabilityDates;
