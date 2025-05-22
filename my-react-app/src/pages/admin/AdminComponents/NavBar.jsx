import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import customFetch from "../../../utils/customFetch.js";
import { toast } from 'react-toastify';

const styles = {
  navbarWrapper: {
    backgroundColor: '#5a3b22',
    width: '100%',
    height: '70px',
    position: 'fixed',
    top: 0,
    zIndex: 1000,
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    flexWrap: 'wrap',
    fontFamily: "'Playfair Display', serif",
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
    marginTop: '5px',
  },
  navItems: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  navItem: {
    color: 'white',
    fontWeight: 'bold',
    textDecoration: 'none',
    padding: '5px 10px',
    transition: 'color 0.3s ease',
  },
  activeLink: {
    color: '#ffd700',
  },
  dropdown: {
    position: 'relative',
    cursor: 'pointer',
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
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: '#5a3b22',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'none',
    minWidth: '100px',
    zIndex: 10,
  },
  dropdownShow: {
    display: 'block',
  },
  dropdownItem: {
    padding: '5px 10px',
    cursor: 'pointer',
  },
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const logoutUser = async () => {
    try {
      await customFetch.get('/auth/logout');
      navigate('/login');
      toast.success('Logging out...');
    } catch {
      toast.error('Error logging out');
    }
  };

  const getLinkStyle = (path) => ({
    ...styles.navItem,
    ...(location.pathname === path ? styles.activeLink : {}),
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await customFetch.get('/users/current-user');
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div style={styles.navbarWrapper}>
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <img src="/images/kape.jpg" alt="Logo" style={styles.logo} />
          <span style={styles.logoText}>Kape Kalakal</span>
        </div>

        <div style={styles.navItems}>
          <Link to="/admin" style={getLinkStyle('/admin')}>HOME</Link>
          <Link to="/admin/products" style={getLinkStyle('/admin/products')}>PRODUCTS</Link>
          <Link to="/admin/orders" style={getLinkStyle('/admin/orders')}>ORDERS</Link>

          <div style={styles.dropdown} onClick={toggleDropdown}>
            <button style={styles.dropdownButton}>
              <span>{user?.name || 'Admin'}</span>
              <span>▼</span>
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
  );
};

export default Navbar;
