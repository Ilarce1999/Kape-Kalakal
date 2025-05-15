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

  return (
    <div style={{ paddingTop: '120px', backgroundColor: '#2c1b0b', minHeight: '100vh', fontFamily: "'Playfair Display', serif" }}>

      {/* Navbar */}
      <div style={{
        backgroundColor: '#5a3b22',
        width: '100%',
        height: navbarHeight,
        position: 'fixed',
        top: 0,
        zIndex: 1000,
        padding: '10px 20px'
      }}>
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          height: '100%',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/images/kape.jpg" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
            <span style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.3rem',
              fontFamily: "'Playfair Display', serif",
              lineHeight: '1.8',
              marginTop: '5px'
            }}>
              Kape Kalakal - Super Admin
            </span>
          </div>

         {/* } <button className="hamburger" onClick={toggleMobileMenu}>☰</button> */}

          <div className={`nav-items ${isMobileMenuOpen ? 'show' : ''}`} style={{ gap: '15px', display: 'flex', alignItems: 'center' }}>
            <Link to="/superadmin" style={getLinkStyle('/superadmin')}>HOME</Link>
            <Link to="/superadmin/manageProducts" style={getLinkStyle('/superadmin/manageProducts')}>MANAGE PRODUCTS</Link>
            <Link to="/superadmin/allUsers" style={getLinkStyle('/superadmin/allUsers')}>MANAGE USERS</Link>

            {/* Dropdown */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button onClick={toggleDropdown} style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
              }}>
                <span>{currentUser?.name || 'Super Admin'}</span>
                <span style={{ fontSize: '18px' }}>▼</span>
              </button>

              {isDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  backgroundColor: '#fff',
                  color: '#371D10',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  zIndex: 100,
                  minWidth: '120px',
                  textAlign: 'center',
                }}>
                  <div style={{ cursor: 'pointer' }} onClick={logoutUser}>Logout</div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

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
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Location</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
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

const thStyle = {
  padding: '12px',
  border: '1px solid #ddd',
  backgroundColor: '#444',
  color: '#fff'
};

const tdStyle = {
  padding: '10px',
  border: '1px solid #ddd'
};

const editButtonStyle = {
  marginRight: '10px',
  padding: '5px 10px',
  backgroundColor: '#2196F3',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

const deleteButtonStyle = {
  padding: '5px 10px',
  backgroundColor: '#f44336',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default AllUsers;
