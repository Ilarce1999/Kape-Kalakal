import React, { useState, useEffect } from 'react';
import {
  Outlet,
  useLoaderData,
  Link,
  useLocation,
  redirect,
  useNavigate,
} from 'react-router-dom';
import customFetch from '../../../utils/customFetch';
import { toast } from 'react-toastify';

const styles = {
  navbarWrapper: {
    backgroundColor: '#8B4513',
    width: '100%',
    height: '10%',
    position: 'fixed',
    top: 0,
    zIndex: 1000
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
  toast: {
    position: 'fixed',
    bottom: '30px',
    right: '30px',
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '1rem',
    boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
    zIndex: 2000,
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
  dropdownItem: {
    padding: '5px 10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
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

export const loader = async () => {
  try {
    const { data } = await customFetch.get('/users/current-user');
    if (data.user.role !== 'admin') {
      return redirect('/dashboard'); // redirect regular users
    }
    return data;
  } catch (error) {
    return redirect('/login');
  }
};

const Admin = () => {
  const { user } = useLoaderData();
  const navigate = useNavigate();
  const location = useLocation();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setToastMessage('Welcome Admin!');
    setToastVisible(true);

    const timer = setTimeout(() => {
      setToastVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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
    await customFetch.get('/auth/logout');
    navigate('/login');
    toast.success('Logging out...');
  };

  return (
    <div style={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh', backgroundColor: '#F5DEB3' }}>
      <div style={styles.navbarWrapper}>
        <nav style={styles.navbar}>
          <div style={styles.navLeft}>
            <img src="/images/kape.jpg" alt="Logo" style={styles.logo} />
            <span style={styles.logoText}>Kape Kalakal - Admin</span>
          </div>
          <div style={styles.navItems}>
            <Link to="/admin" style={getLinkStyle('/admin')}>HOME</Link>
            <Link to="/admin/products" style={getLinkStyle('/admin/products')}>MANAGE PRODUCTS</Link>
            <Link to="/admin/orders" style={getLinkStyle('/admin/orders')}>ORDERS</Link>
            <Link to="/admin/analytics" style={getLinkStyle('/admin/analytics')}>ANALYTICS</Link>
            <Link to="/admin/categories" style={getLinkStyle('/admin/categories')}>MANAGE CATEGORIES</Link>
            <Link to="/admin/transactions" style={getLinkStyle('/admin/transactions')}>TRANSACTIONS</Link>
            <div style={styles.dropdown} onClick={toggleDropdown}>
              <button style={styles.dropdownButton}>
                <span>{user?.name}</span>
                <span style={styles.icon}>▼</span>
              </button>
              <div
                style={{
                  ...styles.dropdownMenu,
                  ...(isDropdownOpen ? styles.dropdownShow : {}),
                }}
              >
                <div style={styles.dropdownItem} onClick={logoutUser}>
                  Logout
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div style={styles.contentContainer}>
        <div style={styles.box}>
          <h2>Welcome, Admin!</h2>
          <p>Manage your products, orders, categories, and view analytics from the navigation above.</p>
          <p>You have full access to the admin tools for Kape Kalakal.</p>
        </div>
      </div>

      {toastVisible && (
        <div style={styles.toast}>
          <p>{toastMessage}</p>
        </div>
      )}

      <Outlet />
    </div>
  );
};

export default Admin;
