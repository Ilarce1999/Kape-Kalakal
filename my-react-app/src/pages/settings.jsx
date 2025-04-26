import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import customFetch from '../../../utils/customFetch'; // Ensure this is correctly imported
import { toast } from 'react-toastify'; // Ensure toast is properly installed and set up

const styles = {
  navbarWrapper: {
    backgroundColor: '#8B4513',
    width: '100%',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 30px',
  },
  navLeft: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    fontFamily: "'Playfair Display', serif",
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'color 0.3s',
    padding: '5px 10px', // Adding padding for better spacing and visual effect
  },
  activeNavLink: {
    backgroundColor: '#A0522D', // Background color for active link
    fontWeight: 'bold', // Ensure bold font for active link
    borderRadius: '5px', // Optional: Adding border-radius for rounded corners
  },
  pageContent: {
    padding: '40px 30px',
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();

  const getLinkStyle = (path) => (location.pathname === path ? styles.activeNavLink : {});

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., update user settings)
    alert('Settings updated!');
  };

  const logoutUser = async () => {
    try {
      await customFetch.get('/auth/logout'); // Perform the logout request.
      navigate('/login'); // Redirect to the login page after logout.
      toast.success('Logging out...'); // Show a success toast message
    } catch (error) {
      toast.error('An error occurred while logging out. Please try again.');
    }
  };

  return (
    <div>
      {/* Navbar */}
      <div style={styles.navbarWrapper}>
        <nav style={styles.navbar}>
          <div style={styles.navLeft}>Kape Kalakal</div>
          <div style={styles.navLinks}>
            <Link to="/dashboard" style={{ ...styles.navLink, ...getLinkStyle('/dashboard') }}>HOME</Link>
            <Link to="/aboutus" style={{ ...styles.navLink, ...getLinkStyle('/aboutus') }}>ABOUT US</Link>
            <Link to="/menu" style={{ ...styles.navLink, ...getLinkStyle('/menu') }}>PRODUCTS</Link>
            <Link to="/settings" style={{ ...styles.navLink, ...getLinkStyle('/settings') }}>SETTINGS</Link>
            <span onClick={logoutUser} style={styles.navLink}>LOGOUT</span>
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
          <button type="submit" style={styles.submitButton}>
            Save Changes
          </button>
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
