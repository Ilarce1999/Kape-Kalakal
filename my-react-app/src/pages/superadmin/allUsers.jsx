import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useLoaderData } from 'react-router-dom';
import customFetch from '../../../../utils/customFetch.js';
import { toast } from 'react-toastify';

export const loader = async () => {
  try {
    const [usersRes, currentUserRes] = await Promise.all([
      customFetch.get('/users/users'),
      customFetch.get('/users/current-user'),
    ]);
    return {
      users: usersRes.data,
      currentUser: currentUserRes.data.user,
    };
  } catch (err) {
    throw new Response("Failed to load users", { status: 500 });
  }
};

const AllUsers = () => {
  const { users: initialUsers, currentUser } = useLoaderData();
  const [users, setUsers] = useState(initialUsers);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const navigate = useNavigate();
  const location = useLocation();

  const navbarHeight = '10%';

  const getLinkStyle = (path) => ({
    color: location.pathname === path ? '#FFD700' : 'white',
    fontWeight: 'bold',
    textDecoration: 'none',
    padding: '5px 10px',
    backgroundColor: 'transparent',
    borderRadius: '5px',
  });

  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

  const logoutUser = async () => {
    try {
      await customFetch.get('/auth/logout');
      toast.success('Logging out...');
      navigate('/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      const response = await customFetch.delete(`/users/users/${userId}`); // Ensure this matches your API route
      console.log("DELETE SUCCESS:", response.data);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId)); // Remove user from local state
      toast.success('User deleted successfully');
    } catch (error) {
      console.error("DELETE ERROR:", error.response?.data || error.message);
      toast.error(error.response?.data?.msg || 'Failed to delete user');
    }
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
    if (!sortConfig.key) return users;

    const sorted = [...users].sort((a, b) => {
      let aField = a[sortConfig.key];
      let bField = b[sortConfig.key];

      if (typeof aField === 'string') aField = aField.toLowerCase();
      if (typeof bField === 'string') bField = bField.toLowerCase();

      if (aField < bField) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aField > bField) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [users, sortConfig]);

  return (
    <div style={{ paddingTop: '120px', backgroundColor: '#2c1b0b', minHeight: '100vh', fontFamily: "'Playfair Display', serif" }}>


      {/* Content */}
      <div style={{ padding: '40px' }}>
        <h2 style={{ marginBottom: '20px', fontFamily: "'Playfair Display', serif", color: 'white' }}>Manage Users</h2>

        <button
          style={{
            backgroundColor: '#5a3b22',
            color: 'white',
            fontSize: '1rem',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            marginBottom: '20px',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/superadmin/addUser')}
        >
          Add New User
        </button>

        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: 'white',
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          <thead>
            <tr>
              <th
                style={thStyle}
                onClick={() => requestSort('name')}
                role="button"
                tabIndex={0}
              >
                Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : null}
              </th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Location</th>
              <th
                style={thStyle}
                onClick={() => requestSort('role')}
                role="button"
                tabIndex={0}
              >
                Role {sortConfig.key === 'role' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : null}
              </th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map(user => (
              <tr key={user._id}>
                <td style={tdStyle}>{user.name}</td>
                <td style={tdStyle}>{user.email}</td>
                <td style={tdStyle}>{user.location}</td>
                <td style={tdStyle}>{user.role}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => navigate(`/superadmin/editUser/${user._id}`, { state: { ...user } })}
                    style={editButtonStyle}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    style={deleteButtonStyle}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Styles
const thStyle = {
  borderBottom: '2px solid #5a3b22',
  padding: '12px 15px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  backgroundColor: '#f9f4f1',
  textAlign: 'left',
};

const tdStyle = {
  padding: '10px 15px',
  borderBottom: '1px solid #ddd',
};

const editButtonStyle = {
  backgroundColor: '#f7b733',
  border: 'none',
  color: '#371D10',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginRight: '10px',
  padding: '6px 12px',
  borderRadius: '5px',
};

const deleteButtonStyle = {
  backgroundColor: '#ff4d4d',
  border: 'none',
  color: 'white',
  fontWeight: 'bold',
  cursor: 'pointer',
  padding: '6px 12px',
  borderRadius: '5px',
};

export default AllUsers;