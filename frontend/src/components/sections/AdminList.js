// AdminList.js
import React from 'react';
import './AdminList.css'; // CSS file for styling

function AdminList() {
  // Static data for demonstration
  const admins = [
    
  ];

  return (
    <div className="admin-list-container">
      <h2>Admin List</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
              <td>{admin.id}</td>
              <td>{admin.name}</td>
              <td>{admin.email}</td>
              <td>{admin.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminList;
