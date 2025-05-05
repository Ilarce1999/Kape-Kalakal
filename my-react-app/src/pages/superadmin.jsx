import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation, useLoaderData, redirect } from 'react-router-dom';
import customFetch from '../../../utils/customFetch';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const loader = async () => {
  try {
    const { data } = await customFetch.get('/users/current-user');
    if (data.user.role !== 'superadmin') {
      return redirect('/dashboard');
    }
    return data;
  } catch (error) {
    return redirect('/login');
  }
};

const SuperAdmin = () => {
  const { user } = useLoaderData();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      color: isActive ? '#FFD700' : 'white',
      fontSize: '1rem',
      fontWeight: 'bold',
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'color 0.3s ease, background-color 0.3s ease',
      padding: '5px 10px',
    };
  };

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

  return (
    <div style={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh', backgroundColor: '#2c1b0b' }}>
      {/* Responsive Styles */}
      <style>
        {`
          .navbar-wrapper {
            background-color: #5a3b22;
            width: 100%;
            height: auto;
            position: fixed;
            top: 0;
            z-index: 1000;
            font-family: 'Playfair Display', serif;
          }

          .navbar {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding: 10px 20px;
            flex-wrap: wrap;
          }

          .nav-left {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .logo {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
          }

          .logo-text {
            color: white;
            font-weight: bold;
            font-size: 1.5rem;
            font-family: 'Playfair Display', serif;
            margin-top: 5px;
          }

          .nav-items {
            display: flex;
            gap: 15px;
            align-items: center;
            flex-wrap: wrap;
            padding-top: 10px;
          }

          .dropdown {
            position: relative;
            cursor: pointer;
          }

          .dropdown-menu {
            position: absolute;
            top: 100%;
            right: 0;
            background-color: white;
            color: #371D10;
            padding: 10px 20px;
            border-radius: 5px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            display: none;
          }

          .dropdown-menu.show {
            display: block;
          }

          .dropdown-button {
            background: none;
            border: none;
            color: white;
            font-size: 1rem;
            display: flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
          }

          .content-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 60px 20px;
            margin-top: 120px;
          }

          .box {
            width: 90%;
            max-width: 800px;
            background-color: white;
            border-radius: 15px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
            padding: 30px;
            text-align: center;
            font-family: 'Playfair Display', serif;
          }

          @media (max-width: 768px) {
            .navbar {
              flex-direction: column;
              align-items: flex-start;
            }
            .nav-items {
              flex-direction: column;
              gap: 10px;
              align-items: flex-start;
            }
            .logo-text {
              font-size: 1.2rem;
            }
            .box {
              padding: 20px;
            }
          }

          @media (max-width: 480px) {
            .logo {
              width: 30px;
              height: 30px;
            }
            .logo-text {
              font-size: 1rem;
            }
            .dropdown-button {
              font-size: 0.9rem;
            }
          }
        `}
      </style>

      {/* Navbar */}
      <div className="navbar-wrapper">
        <nav className="navbar">
          <div className="nav-left">
            <img src="/images/kape.jpg" alt="Logo" className="logo" />
            <span className="logo-text">Kape Kalakal - Super Admin</span>
          </div>
          <div className="nav-items">
            <Link to="/superadmin" style={getLinkStyle('/superadmin')}>HOME</Link>
            <Link to="/superadmin/manageProducts" style={getLinkStyle('/superadmin/manageProducts')}>MANAGE PRODUCTS</Link>
            <Link to="/superadmin/allUsers" style={getLinkStyle('/superadmin/allUsers')}>MANAGE USERS</Link>
            <div className="dropdown" onClick={toggleDropdown}>
              <button className="dropdown-button">
                <span>Super Admin</span>
                <span style={{ fontSize: '18px' }}>▼</span>
              </button>
              <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                <div onClick={logoutUser}>Logout</div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Page Content */}
      <div className="content-container">
        <div className="box">
          <h2>Welcome, Super Admin!</h2>
          <p>Use the navigation above to manage products, users, and your dashboard settings.</p>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default SuperAdmin;
