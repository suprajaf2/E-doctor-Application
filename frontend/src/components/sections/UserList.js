import React, { useState, useEffect } from 'react';
import './UserList.css';

function UserList() {
  const [users, setUsers] = useState([]);

  // Fetch user data from an API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users'); // Replace with your API endpoint
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="user-list-container">
      <h2>User List</h2>
      <table className="user-list-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Registration Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.registrationDate}</td>
              <td>
                <button className="view-button">View</button>
                <button className="edit-button">Edit</button>
                <button className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
