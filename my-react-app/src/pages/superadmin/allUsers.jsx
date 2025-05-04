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

const AllUsers = () => {
  const { users: initialUsers, currentUser } = useLoaderData();
  const [users, setUsers] = useState(initialUsers);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navbarHeight = '10%';

  const getLinkStyle = (path) => ({
    color: 'white',
    fontWeight: 'bold',
    textDecoration: 'none',
    padding: '5px 10px',
    backgroundColor: location.pathname === path ? '#A0522D' : 'transparent',
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

  return (
    <div style={{ paddingTop: '120px', backgroundColor: '#F5DEB3', minHeight: '100vh' }}>
      <style>
        {`
          @media (max-width: 768px) {
            .nav-items {
              flex-direction: column;
              align-items: flex-start;
              background-color: #8B4513;
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
          }
          @media (min-width: 769px) {
            .hamburger {
              display: none;
            }
            .nav-items {
              display: flex !important;
              flex-direction: row;
            }
          }
        `}
      </style>

      <div style={{
        backgroundColor: '#8B4513',
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
              fontSize: '1.5rem',
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
      <div style={{ padding: '40px' }}>
        <h2 style={{ marginBottom: '20px', fontFamily: "'Playfair Display', serif" }}>Manage Users</h2>

        <button
          style={{
            backgroundColor: '#4CAF50',
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
              <th style={{ padding: '12px', border: '1px solid #ddd', backgroundColor: '#444', color: '#fff' }}>Name</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', backgroundColor: '#444', color: '#fff' }}>Email</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', backgroundColor: '#444', color: '#fff' }}>Location</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', backgroundColor: '#444', color: '#fff' }}>Role</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', backgroundColor: '#444', color: '#fff' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.email}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.location}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.role}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <button
                    onClick={() => navigate(`/superadmin/editUser/${user._id}`)}
                    style={{
                      marginRight: '10px',
                      padding: '5px 10px',
                      backgroundColor: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => navigate(`/superadmin/deleteUser/${user._id}`)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
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

export default AllUsers;
