import React from 'react';
import { useLoaderData } from 'react-router-dom';


export const loader = async () => {
  const { data } = await customFetch.get('/admin/users');
  return data;
};

const Users = () => {
  const users = useLoaderData();

  return (
    <div>
      <h1>Manage Users Page</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
