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
    lineHeight: '1.8',
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
    paddingTop: '10px',
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
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '60px 20px',
    marginTop: '120px',
  },
  box: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
    padding: '40px',
    textAlign: 'center',
    fontFamily: "'Playfair Display', serif",
  },
};

const SuperAdmin = () => {
  const { user } = useLoaderData();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      ...styles.navItem,
      ...(isActive ? styles.activeLink : {}),
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
    <div style={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh', backgroundColor: '#F5DEB3' }}>
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
                <span>Super Admin</span>
                <span style={styles.icon}>▼</span>
              </button>
              <div
                style={{
                  ...styles.dropdownMenu,
                  ...(isDropdownOpen ? styles.dropdownShow : {}),
                }}
              >
                <div style={styles.dropdownItem} onClick={logoutUser}>Logout</div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div style={styles.contentContainer}>
        <div style={styles.box}>
          <h2>Welcome, Super Admin!</h2>
          <p>Use the navigation above to manage products, users, and your dashboard settings.</p>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default SuperAdmin;
