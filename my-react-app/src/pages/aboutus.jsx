import React, { useState } from 'react';
import { Link, useLocation, useNavigate, useLoaderData, redirect } from 'react-router-dom';
import customFetch from '../../../utils/customFetch';
import { toast } from 'react-toastify';

// ADD THIS LOADER export here
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
    height: '10%',  // Adjusted height
    position: 'fixed',
    top: 0,
    zIndex: 1000
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    lineHeight: '1.8',  // Add line height to adjust the vertical position of text
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center', // Ensure the logo and text are vertically centered
    gap: '10px', // Space between logo and text
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
    marginTop: '5px', // <-- add this
  },
  navItems: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center', // Align items vertically
    paddingTop: '10px',  // Adjust padding to move text down
  },
  navItem: {
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'color 0.3s ease, background-color 0.3s ease',
    padding: '5px 10px', // Ensure consistent padding for all links
  },
  navRight: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '500',
    transition: 'background-color 0.3s ease',
  },
  activeLink: {
    backgroundColor: '#A0522D', // Highlight background for the active link
    fontWeight: 'bold', // Make the text bold for the active link
    borderRadius: '5px', // Rounded corners for the active link
  },
  logoutButton: {
    backgroundColor: 'transparent',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    border: 'none',
    fontSize: '1rem',
  },
  footer: {
    backgroundColor: '#8B4513',
    color: 'white',
    textAlign: 'center',
    padding: '20px 0',
    fontSize: '0.9rem',
    fontFamily: "'Playfair Display', serif",
    marginTop: '40px',
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '10px',
  },
  footerLink: {
    color: 'white',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
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
  dropdownItem: {
    padding: '5px 10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
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
};

const AboutUs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useLoaderData();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path || (path === '/' && location.pathname === '/');
    
    return {
      ...styles.navItem,
      ...(isActive ? styles.activeLink : {}),
    };
  }

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
          <div style={{ position: 'relative', zIndex: 1 }}>
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
          </div>

  
       <div style={{ padding: '40px 30px' }}>
        {/* First Row */}
        {/* First Row - Adjusted Layout */}
<div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginBottom: '60px' }}>
  <div style={{ flex: '1 1 50%', paddingRight: '30px', marginBottom: '20px' }}>
  <img
  src="/images/Kapeng_Barako.jpg"
  alt="Kape Kalakal Storefront"
  style={{
    width: '100%',
    borderRadius: '12px',
    objectFit: 'cover',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    maxHeight: '400px',
    marginTop: '80px', // <-- pushes the image down
  }}
/>
  </div>
  <div style={{ flex: '1 1 50%', paddingLeft: '30px', minWidth: '300px' }}>
    <h2 style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: '2rem',
      color: '#4B2E2E',
      marginBottom: '20px'
    }}>
      Welcome to Kape Kalakal
    </h2>
    <p style={{ fontSize: '1.1rem', color: '#333', lineHeight: '1.8' }}>
      Kape Kalakal is not just your typical coffee hub—it's a celebration of Filipino craftsmanship.
      Our mission is to serve quality coffee while uplifting local farmers and artisans.
      Each cup brewed is rooted in community and sustainability, giving you more than just a caffeine fix.
    </p>
  </div>
</div>

        {/* Second Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap-reverse', alignItems: 'center' }}>
          <div style={{ flex: '1 1 50%', paddingRight: '40px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#4B2E2E', marginBottom: '20px' }}>
              Supporting Local, Brewing Excellence
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#333', lineHeight: '1.8' }}>
              From Barako beans in Batangas to Kape Alamid in Mindanao, we carefully curate our blends
              to bring the best of Philippine flavors into every sip. Whether you’re here for a quick espresso
              or a long conversation over iced latte, you’re always part of the Kape Kalakal family.
            </p>
          </div>
          <img
            src="/images/barako_beans.jpg"
            alt="Kape Kalakal Beans"
            style={{
              flex: '1 1 50%',
              width: '100%',
              maxWidth: '600px',
              borderRadius: '12px',
              objectFit: 'cover',
              marginBottom: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          />
        </div>
      </div>


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

export default AboutUs;
