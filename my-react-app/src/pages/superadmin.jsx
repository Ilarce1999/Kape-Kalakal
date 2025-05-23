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
