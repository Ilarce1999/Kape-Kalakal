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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    role: 'user',
  });

  const navigate = useNavigate();
  const location = useLocation();

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await customFetch.post('/users/register', formData);
      setUsers(prev => [...prev, response.data.user]);
      toast.success('User added successfully!');
      setFormData({ name: '', email: '', location: '', role: 'user' });
    } catch (err) {
      toast.error(err?.response?.data?.msg || 'Error adding user');
    }
  };

  return (
    <div style={{
      backgroundColor: '#2c1b0b',
      minHeight: '100vh',
      fontFamily: "'Playfair Display', serif"
    }}>
      <style>
        {`
          @media (max-width: 768px) {
            .nav-items {
              flex-direction: column;
              align-items: flex-start;
              background-color: #2c1b0b;
              width: 100%;
              padding: 10px;
              display: none;
            }
            .nav-items.show {
              display: flex;
            }
            .hamburger {
              display: block;
              color: white;
              font-size: 24px;
              background: none;
              border: none;
              cursor: pointer;
            }
            .nav-items a {
              padding: 10px;
              font-size: 1rem;
              font-family: 'Playfair Display', serif;
            }
          }
          @media (min-width: 769px) {
            .hamburger {
              display: none;
            }
            .nav-items {
              display: flex !important;
              flex-direction: row;
              justify-content: flex-end;
            }
            .nav-items a {
              font-size: 0.95rem;
            }
          }
        `}
      </style>

      {/* Navbar */}
      <div style={{
        backgroundColor: '#5a3b22',
        width: '100%',
        height: '80px',
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

          <button className="hamburger" onClick={toggleMobileMenu}>☰</button>

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
      <div style={{
        padding: '120px 40px 40px 40px'
      }}>
        <h2 style={{ marginBottom: '20px', fontFamily: "'Playfair Display', serif", color: 'white' }}>Manage Users</h2>

        {/* Add User Form */}
        <form onSubmit={handleAddUser} style={{
          marginBottom: '40px',
          backgroundColor: '#fff8f0',
          padding: '16px',
          borderRadius: '10px',
          maxWidth: '400px'
        }}>
          <label style={{ fontWeight: 'bold', color: '#5c3a1d' }}>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={inputStyle} />

          <label style={{ fontWeight: 'bold', color: '#5c3a1d' }}>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} required style={inputStyle} />

          <label style={{ fontWeight: 'bold', color: '#5c3a1d' }}>Location:</label>
          <input type="text" name="location" value={formData.location} onChange={handleInputChange} required style={inputStyle} />

          <label style={{ fontWeight: 'bold', color: '#5c3a1d' }}>Role:</label>
          <select name="role" value={formData.role} onChange={handleInputChange} required style={inputStyle}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" style={{
            backgroundColor: '#5a3b22',
            color: 'white',
            padding: '12px 20px',
            border: 'none',
            borderRadius: '5px',
            fontSize: '1rem',
            cursor: 'pointer',
            width: '100%'
          }}>
            Submit
          </button>
        </form>

        {/* Users Table */}
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
                    onClick={() =>
                      navigate(`/superadmin/editUser/${user._id}`, { state: user })
                    }
                    style={editButtonStyle}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/superadmin/deleteUser/${user._id}`, { state: user })
                    }
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
  padding: '12px', border: '1px solid #ddd', backgroundColor: '#444', color: '#fff'
};
const tdStyle = {
  padding: '10px', border: '1px solid #ddd'
};
const inputStyle = {
  width: '100%', padding: '12px', marginBottom: '15px',
  borderRadius: '5px', border: '1px solid #ccc'
};
const editButtonStyle = {
  marginRight: '10px', padding: '5px 10px', backgroundColor: '#2196F3',
  color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'
};
const deleteButtonStyle = {
  padding: '5px 10px', backgroundColor: '#f44336',
  color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'
};

export default AllUsers;
