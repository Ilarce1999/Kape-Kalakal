import React, { useState } from 'react';
import { Link, useLocation, useNavigate, useLoaderData, redirect } from 'react-router-dom';
import customFetch from '../../../utils/customFetch';
import { toast } from 'react-toastify';

export const loader = async () => {
  try {
    const { data } = await customFetch.get('/users/current-user');
    return data;
  } catch (error) {
    return redirect('/');
  }
};

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh', // Ensures the entire page is used
  },
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    flexWrap: 'wrap',
    gap: '10px',
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
    fontFamily: "'Playfair Display', serif",
    lineHeight: '1.8',
    marginTop: '5px',
  },
  navItems: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '10px',
    alignItems: 'center',
    justifyContent: 'center',
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
    right: '0',
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
    transition: 'background-color 0.3s ease',
  },
  pageContent: {
    padding: '140px 5vw 40px',
    textAlign: 'center',
    backgroundColor: '#2c1b0b',
    fontFamily: "'Playfair Display', serif",
    color: 'white',
    flex: 1, // This ensures the content fills the remaining space
  },
  form: {
    maxWidth: '600px',
    width: '90%',
    margin: '0 auto',
    textAlign: 'left',
    backgroundColor: '#F5DEB3',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    boxSizing: 'border-box',
    color: 'black', // Add this to change the text color to black
  },
  inputField: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '1rem',
    boxSizing: 'border-box',
    fontFamily: "'Roboto', sans-serif",
    color: 'black', // Ensure input text is black
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#8B4513',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
    boxSizing: 'border-box',
  },
  footer: {
    backgroundColor: '#5a3b22',
    color: 'white',
    fontSize: '0.9rem',
    fontFamily: "'Playfair Display', serif",
    padding: '40px 20px 20px',
  },
  footerColumns: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    textAlign: 'left',
    gap: '20px',
  },
  footerColumn: {
    flex: '1 1 100%',
    maxWidth: '100%',
    marginBottom: '20px',
  },
  footerHeading: {
    fontSize: '1.1rem',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '30px',
    flexWrap: 'wrap',
  },
  footerLink: {
    color: 'white',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
  },
};

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useLoaderData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      ...styles.navItem,
      ...(isActive ? styles.activeLink : {}),
    };
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert('Settings updated!');
  };

  const logoutUser = async () => {
    try {
      await customFetch.get('/auth/logout');
      navigate('/login');
      toast.success('Logging out...');
    } catch (error) {
      toast.error('An error occurred while logging out.');
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Navbar */}
      <div style={styles.navbarWrapper}>
        <nav style={styles.navbar}>
          <div style={styles.navLeft}>
            <img src="/images/kape.jpg" alt="Logo" style={styles.logo} />
            <span style={styles.logoText}>Kape Kalakal</span>
          </div>
          <div style={styles.navItems}>
            <Link to="/dashboard" style={getLinkStyle('/dashboard')}>HOME</Link>
            <Link to="/aboutus" style={getLinkStyle('/aboutus')}>ABOUT US</Link>
            <Link to="/menu" style={getLinkStyle('/menu')}>PRODUCTS</Link>
            <Link to="/settings" style={getLinkStyle('/settings')}>SETTINGS</Link>
            <div style={styles.dropdown} onClick={toggleDropdown}>
              <button style={styles.dropdownButton}>
                <span>{user?.name}</span>
                <span>▼</span>
              </button>
              <div style={{ ...styles.dropdownMenu, ...(isDropdownOpen ? styles.dropdownShow : {}) }}>
                <div style={styles.dropdownItem} onClick={logoutUser}>Logout</div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Settings Form */}
      <div style={styles.pageContent}>
        <h2>Settings</h2>
        <p>Update your profile information below:</p>
        <form style={styles.form} onSubmit={handleFormSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={styles.inputField}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your new password"
            style={styles.inputField}
          />
          <button type="submit" style={styles.submitButton}>Save Changes</button>
        </form>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', padding: '0 20px' }}>
          <div style={{ flex: '1 1 250px', margin: '10px' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Customer Service</h4>
            <p>Need help? Our team is here for you 24/7.</p>
            <p>FAQs</p>
            <p>Returns & Refunds</p>
            <p>Order Tracking</p>
          </div>
          <div style={{ flex: '1 1 250px', margin: '10px' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Contact Us</h4>
            <p>Email: support@kapekalakal.com</p>
            <p>Phone: +63 912 345 6789</p>
            <p>Address: 123 Brew Street, Makati, PH</p>
          </div>
          <div style={{ flex: '1 1 250px', margin: '10px' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>About Us</h4>
            <p>Kape Kalakal is your go-to café for premium Filipino coffee blends. We're passionate about coffee and community.</p>
            <p>Read Our Story</p>
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <p>© 2025 Kape Kalakal. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Settings;