import React, { useEffect, useState } from 'react';
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

const styles = {
  navbarWrapper: {
    backgroundColor: '#8B4513',
    width: '100%',
    height: '10%',
    position: 'fixed',
    top: 0,
    zIndex: 1000,
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logo: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  logoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    fontFamily: "'Playfair Display', serif",
    lineHeight: '1.8',
    marginTop: '5px',
  },
  navItems: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  navItem: {
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'color 0.3s ease, background-color 0.3s ease',
    padding: '5px 10px',
  },
  activeLink: {
    backgroundColor: '#A0522D',
    fontWeight: 'bold',
    borderRadius: '5px',
  },
  dropdown: {
    position: 'relative',
    cursor: 'pointer',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    right: '0',
    backgroundColor: '#fff',
    color: '#371D10',
    padding: '10px 20px',
    borderRadius: '5px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'none',
  },
  dropdownShow: {
    display: 'block',
  },
  dropdownButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  icon: {
    fontSize: '18px',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '1rem',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    marginBottom: '20px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

const AllUsers = () => {
  const { users: initialUsers, currentUser } = useLoaderData();
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const getLinkStyle = (path) => ({
    ...styles.navItem,
    ...(location.pathname === path ? styles.activeLink : {}),
  });

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const logoutUser = async () => {
    try {
      await customFetch.get('/auth/logout');
      toast.success('Logging out...');
      navigate('/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const tableHeaderStyle = {
    padding: '12px',
    border: '1px solid #ddd',
    backgroundColor: '#444',
    color: '#fff',
    textAlign: 'left',
  };

  const tableCellStyle = {
    padding: '12px',
    border: '1px solid #ddd',
  };

  const editButtonStyle = {
    padding: '8px 14px',
    marginRight: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const deleteButtonStyle = {
    padding: '8px 14px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  // Handle Edit and Delete button clicks
  const handleEdit = (userId) => {
    navigate(`/superadmin/editUser/${userId}`);
  };

  const handleDelete = (userId) => {
    navigate(`/superadmin/deleteUser/${userId}`);
  };

  return (
    <div style={{ paddingTop: '80px', backgroundColor: '#F5DEB3', minHeight: '100vh' }}>
      {/* Navbar */}
      <div style={styles.navbarWrapper}>
        <nav style={styles.navbar}>
          <div style={styles.navLeft}>
            <img src="/images/kape.jpg" alt="Logo" style={styles.logo} />
            <span style={styles.logoText}>Kape Kalakal - Super Admin</span>
          </div>
          <div style={styles.navItems}>
            <Link to="/superadmin" style={getLinkStyle('/superadmin')}>HOME</Link>
            <Link to="/superadmin/manageProducts" style={getLinkStyle('/superadmin/manageProducts')}>MANAGE PRODUCTS</Link>
            <Link to="/superadmin/allUsers" style={getLinkStyle('/superadmin/allUsers')}>MANAGE USERS</Link>

            <div style={styles.dropdown} onClick={toggleDropdown}>
              <button style={styles.dropdownButton}>
                <span>{currentUser?.name || 'Super Admin'}</span>
                <span style={styles.icon}>▼</span>
              </button>
              <div
                style={{
                  ...styles.dropdownMenu,
                  ...(isDropdownOpen ? styles.dropdownShow : {}),
                }}
              >
                <div style={{ cursor: 'pointer' }} onClick={logoutUser}>Logout</div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Content */}
      <div style={{ padding: '40px' }}>
        <h2 style={{ marginBottom: '20px', fontFamily: "'Playfair Display', serif" }}>Manage Users</h2>

        {/* Add User Button */}
        <button
          style={styles.addButton}
          onClick={() => navigate('/superadmin/addUser')}
        >
          Add New User
        </button>

        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Name</th>
              <th style={tableHeaderStyle}>Email</th>
              <th style={tableHeaderStyle}>Location</th>
              <th style={tableHeaderStyle}>Role</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Loading users...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No users found.</td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user._id} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff' }}>
                  <td style={tableCellStyle}>{user.name}</td>
                  <td style={tableCellStyle}>{user.email}</td>
                  <td style={tableCellStyle}>{user.location}</td>
                  <td style={tableCellStyle}>{user.role}</td>
                  <td style={tableCellStyle}>
                    <button style={editButtonStyle} onClick={() => handleEdit(user._id)}>Edit</button>
                    <button style={deleteButtonStyle} onClick={() => handleDelete(user._id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
