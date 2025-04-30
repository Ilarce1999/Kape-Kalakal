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
  dropdownItem: {
    padding: '5px 10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  pageContent: {
    padding: '160px 30px 40px', // pushed down below navbar
    textAlign: 'center',
    fontFamily: "'Playfair Display', serif",
  },
  form: {
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'left',
    backgroundColor: '#F5DEB3',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  inputField: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  submitButton: {
    padding: '12px 20px',
    backgroundColor: '#8B4513',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  footer: {
    backgroundColor: '#8B4513',
    color: 'white',
    fontSize: '0.9rem',
    fontFamily: "'Playfair Display', serif",
    marginTop: '40px',
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
    flex: '1 1 250px',
    maxWidth: '300px',
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
    <div style={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh', backgroundColor: '#F5DEB3' }}>
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

      {/* Optional Image */}
      {/* <img
        src="/images/Kapeng_Barako.jpg"
        alt="Kape Kalakal Storefront"
        style={{
          width: '100%',
          borderRadius: '12px',
          objectFit: 'cover',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          maxHeight: '400px',
          marginTop: '120px',
        }}
      /> */}

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
        <div style={styles.footerColumns}>
          <div style={styles.footerColumn}>
            <h4 style={styles.footerHeading}>Customer Service</h4>
            <p>Need help? Our team is here for you 24/7.</p>
            <p>FAQs</p>
            <p>Returns & Refunds</p>
            <p>Order Tracking</p>
          </div>
          <div style={styles.footerColumn}>
            <h4 style={styles.footerHeading}>Contact Us</h4>
            <p>Email: support@kapekalakal.com</p>
            <p>Phone: +63 912 345 6789</p>
            <p>Address: 123 Brew Street, Makati, PH</p>
          </div>
          <div style={styles.footerColumn}>
            <h4 style={styles.footerHeading}>About Us</h4>
            <p>
              Kape Kalakal is your go-to café for premium Filipino coffee blends. We're passionate
              about coffee and community.
            </p>
            <p>Read Our Story</p>
          </div>
        </div>
        <div style={styles.footerLinks}>
          <a href="/dashboard" style={styles.footerLink}>Home</a>
          <a href="/aboutus" style={styles.footerLink}>About Us</a>
          <a href="/menu" style={styles.footerLink}>Menu</a>
          <a href="/settings" style={styles.footerLink}>Settings</a>
        </div>
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          &copy; {new Date().getFullYear()} Kape Kalakal. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Settings;
