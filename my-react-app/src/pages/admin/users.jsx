import React from 'react';
import { useLoaderData } from 'react-router-dom';
import customFetch from '../../../../utils/customFetch.js';

export const loader = async () => {
  const { users } = await customFetch.get('/superadmin/data');
  return users;
};

const Users = () => {
  const users = useLoaderData();

  const deleteUser = async (userId) => {
    try {
      await customFetch.delete(`/admin/users/${userId}`);
      window.location.reload(); // Refresh to show updated list
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  return (
    <div>
      <h1>Manage Users</h1>
      <table border="1" cellPadding="10" style={{ width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(({ _id, name, email, location }) => (
            <tr key={_id}>
              <td>{name}</td>
              <td>{email}</td>
              <td>{location}</td>
              <td>
                <button onClick={() => alert('Implement edit logic')}>Edit</button>
                <button onClick={() => deleteUser(_id)} style={{ marginLeft: '10px' }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
