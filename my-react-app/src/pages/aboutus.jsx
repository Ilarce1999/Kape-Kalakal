import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import customFetch from '../../../utils/customFetch';
import { toast } from 'react-toastify';

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
    flexWrap: 'wrap',
  },
  navLeft: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    fontFamily: "'Playfair Display', serif",
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '10px', // Add margin to separate logo and text
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    transition: 'background-color 0.3s ease',
    fontWeight: '500',
  },
  activeLink: {
    backgroundColor: '#A0522D',
    fontWeight: 'bold',
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
};

const AboutUs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getLinkStyle = (path) => ({
    ...styles.navLink,
    ...(location.pathname === path ? styles.activeLink : {}),
  });



  const logoutUser = async () => {
    try {
      await customFetch.get('/auth/logout');
      toast.success('Logged out successfully');
      navigate('/login'); // Redirect to the login page after successful logout
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <div>
      <div style={styles.navbarWrapper}>
        <nav style={styles.navbar}>
          <div style={styles.navLeft}>
            <img src="/images/kape.jpg" alt="Logo" style={styles.logo} />
            <span>Kape Kalakal</span>
          </div>
          <div style={styles.navLinks}>
            <Link to="/dashboard" style={getLinkStyle('/dashboard')}>HOME</Link>
            <Link to="/aboutus" style={getLinkStyle('/aboutus')}>ABOUT US</Link>
            <Link to="/menu" style={getLinkStyle('/menu')}>PRODUCTS</Link>
            <Link to="/settings" style={getLinkStyle('/settings')}>SETTINGS</Link>
            <span
              onClick={logoutUser}
              style={{ ...getLinkStyle('/'), cursor: 'pointer' }} // Add cursor pointer here
            >
              LOGOUT
            </span>
          </div>
        </nav>
      </div>

      <div style={{ padding: '40px 30px' }}>
        {/* First Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', marginBottom: '60px' }}>
          <img
            src="/images/Kapeng_Barako.jpg"
            alt="Kape Kalakal Storefront"
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
          <div style={{ flex: '1 1 50%', paddingLeft: '40px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#4B2E2E', marginBottom: '20px' }}>
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
            <p>
              Kape Kalakal is your go-to café for premium Filipino coffee blends. We're passionate about coffee and community.
            </p>
            <p>Read Our Story</p>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <div style={styles.footerLinks}>
            <a href="/dashboard" style={styles.footerLink}>Home</a>
            <a href="/aboutus" style={styles.footerLink}>About Us</a>
            <a href="/menu" style={styles.footerLink}>Menu</a>
            <a href="/settings" style={styles.footerLink}>Settings</a>
          </div>
          &copy; {new Date().getFullYear()} Kape Kalakal. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
