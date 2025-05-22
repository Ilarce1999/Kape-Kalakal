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
  cartIconWrapper: {
    position: 'relative',
    cursor: 'pointer',
    color: 'white',
    fontSize: '1.4rem',
  },
  cartBadge: {
    position: 'absolute',
    top: '-6px',
    right: '-8px',
    backgroundColor: '#ffd700',
    color: '#5a3b22',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null); // ← new user state

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

  // 🛒 Update cart count
  useEffect(() => {
    const orderDetails = JSON.parse(localStorage.getItem('orderDetails')) || [];
    const totalQuantity = orderDetails.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(totalQuantity);
  }, [location]);

  // 👤 Fetch current user
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
          <Link to="/dashboard" style={getLinkStyle('/dashboard')}>HOME</Link>
          <Link to="/aboutus" style={getLinkStyle('/aboutus')}>ABOUT US</Link>
          <Link to="/viewMyOrder" style={getLinkStyle('/viewMyOrder')}>MY ORDERS</Link>
          <Link to="/menu" style={getLinkStyle('/menu')}>PRODUCTS</Link>
          <Link to="/settings" style={getLinkStyle('/settings')}>SETTINGS</Link>

          {/* 🛒 Cart Icon */}
          <div
            style={styles.cartIconWrapper}
            title="View Cart"
            onClick={() => navigate('/checkout')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="24"
              height="24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.3 5.4a1 1 0 001 1.2h12a1 1 0 001-1.2L17 13M7 13l1.6-6H19"
              />
            </svg>
            {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
          </div>

          {/* 👤 User Dropdown */}
          <div style={styles.dropdown} onClick={toggleDropdown}>
            <button style={styles.dropdownButton}>
              <span>{user?.name || 'User'}</span>
              <span>▼</span>
            </button>
            <div
              style={{
                ...styles.dropdownMenu,
                ...(isDropdownOpen ? styles.dropdownShow : {}),
              }}
            >
              <div style={styles.dropdownItem} onClick={() => navigate('/profile')}>
                Profile
              </div>
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
