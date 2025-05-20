import React, { useState, useEffect } from 'react';
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

const AboutUs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useLoaderData();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth <= 768;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      color: 'white',
      fontSize: '1rem',
      fontWeight: 'bold',
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'color 0.3s ease, background-color 0.3s ease',
      padding: '5px 10px',
      fontFamily: "'Playfair Display', serif",
      ...(isActive ? {
        color: '#FFD700', // Yellow background for active links
        borderRadius: '5px',
      } : {
        ':hover': {
          backgroundColor: '#FFD700', // Yellow on hover
        },
      })
    };
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const logoutUser = async () => {
    await customFetch.get('/auth/logout');
    navigate('/login');
    toast.success('Logging out...');
  };

  const styles = {
    container: {
      position: 'relative',
      overflowX: 'hidden',
      minHeight: '100vh',
      backgroundColor: '#2c1b0b', // Same as Menu page background color
      paddingTop: '60px',
      fontFamily: "'Playfair Display', serif", // Same font family
      color: 'white',
    },
    navbarWrapper: {
      backgroundColor: '#5a3b22', // Same as Menu page navbar background color
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
      padding: isMobile ? '8px 12px' : '10px 20px',
      height: '100%',
    },
    navLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    logo: {
      width: isMobile ? '30px' : '40px',
      height: isMobile ? '30px' : '40px',
      borderRadius: '50%',
      objectFit: 'cover',
    },
    logoText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: isMobile ? '1.2rem' : '1.5rem',
      marginTop: '5px',
    },
    navItems: {
      display: isMobile ? (isDropdownOpen ? 'flex' : 'none') : 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '10px' : '20px',
      alignItems: 'center',
      position: isMobile ? 'absolute' : 'static',
      top: '60px',
      right: 0,
      backgroundColor: isMobile ? '#5a3b22' : 'transparent',
      padding: isMobile ? '10px' : 0,
      zIndex: 999,
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
      display: isDropdownOpen ? 'block' : 'none',
      zIndex: 1001,
    },
    dropdownItem: {
      padding: '5px 10px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    contentWrapper: {
      padding: isMobile ? '20px 16px' : '40px 30px',
    },
    row: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: 'center',
      marginBottom: '60px',
    },
    rowReverse: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row-reverse',
      alignItems: 'center',
    },
    textCol: {
      flex: '1 1 50%',
      padding: isMobile ? '10px 0' : '0 30px',
      minWidth: '300px',
    },
    image: {
      width: '100%',
      borderRadius: '12px',
      objectFit: 'cover',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      marginTop: isMobile ? '20px' : '80px',
      maxHeight: '400px',
    },
    title: {
      fontFamily: "'Playfair Display', serif",
      fontSize: '2rem',
      color: '#FFD700',
      marginBottom: '20px',
    },
    paragraph: {
      fontSize: '1.1rem',
      color: '#FFF',
      lineHeight: '1.8',
    },
    footer: {
      backgroundColor: '#5a3b22',
      color: 'white',
      textAlign: 'center',
      padding: '20px 0',
      fontSize: '0.9rem',
      fontFamily: "'Playfair Display', serif",
      marginTop: '40px',
    },
    footerLinksContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      padding: '0 20px',
    },
    footerColumn: {
      flex: '1 1 250px',
      margin: '10px',
    },
  };

  return (
    <div style={styles.container}>
      {/* NAVBAR */}
      <div style={styles.navbarWrapper}>
        <nav style={styles.navbar}>
          <div style={styles.navLeft}>
            <img src="/images/kape.jpg" alt="Logo" style={styles.logo} />
            <span style={styles.logoText}>Kape Kalakal</span>
          </div>
          {isMobile ? (
            <div onClick={toggleDropdown} style={styles.dropdownButton}>
              <span style={{ fontSize: '20px' }}>☰</span>
            </div>
          ) : null}
          <div style={styles.navItems}>
            <Link to="/dashboard" style={getLinkStyle('/dashboard')}>HOME</Link>
            <Link to="/aboutus" style={getLinkStyle('/aboutus')}>ABOUT US</Link>
            <Link to="/viewMyOrder" style={getLinkStyle('/viewMyOrder')}>MY ORDERS</Link>
            <Link to="/menu" style={getLinkStyle('/menu')}>PRODUCTS</Link>
            <Link to="/settings" style={getLinkStyle('/settings')}>SETTINGS</Link>
            <div style={styles.dropdown}>
              <button style={styles.dropdownButton} onClick={toggleDropdown}>
                <span>{user?.name}</span>
                <span style={{ fontSize: '18px' }}>▼</span>
              </button>
              <div style={styles.dropdownMenu}>
                <div
                  style={styles.dropdownItem}
                  onClick={() => navigate('/profile')}
                >
                  Profile
                </div>
                <div
                  style={styles.dropdownItem}
                  onClick={logoutUser}
                >
                  Logout
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* CONTENT */}
      <div style={styles.contentWrapper}>
        <div style={styles.row}>
          <div style={styles.textCol}>
            <h2 style={styles.title}>Welcome to Kape Kalakal</h2>
            <p style={styles.paragraph}>
              Kape Kalakal is not just your typical coffee hub—it's a celebration of Filipino craftsmanship.
              Our mission is to serve quality coffee while uplifting local farmers and artisans.
              Each cup brewed is rooted in community and sustainability, giving you more than just a caffeine fix.
            </p>
          </div>
          <div style={styles.textCol}>
            <img src="/images/Kapeng_Barako.jpg" alt="Kape Kalakal Storefront" style={styles.image} />
          </div>
        </div>

        <div style={styles.rowReverse}>
          <div style={styles.textCol}>
            <h2 style={styles.title}>Supporting Local, Brewing Excellence</h2>
            <p style={styles.paragraph}>
              From Barako beans in Batangas to Kape Alamid in Mindanao, we carefully curate our blends
              to bring the best of Philippine flavors into every sip. Whether you’re here for a quick espresso
              or a long conversation over iced latte, you’re always part of the Kape Kalakal family.
            </p>
          </div>
          <div style={styles.textCol}>
            <img src="/images/barako_beans.jpg" alt="Kape Kalakal Beans" style={styles.image} />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerLinksContainer}>
          <div style={styles.footerColumn}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Customer Service</h4>
            <p>Need help? Our team is here for you 24/7.</p>
            <p>FAQs</p>
            <p>Returns & Refunds</p>
            <p>Order Tracking</p>
          </div>
          <div style={styles.footerColumn}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Contact Us</h4>
            <p>Email: support@kapekalakal.com</p>
            <p>Phone: +63 912 345 6789</p>
            <p>Address: 123 Brew Street, Makati, PH</p>
          </div>
          <div style={styles.footerColumn}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>About Us</h4>
            <p>Kape Kalakal is your go-to café for premium Filipino coffee blends. We're passionate about coffee and community.</p>
          </div>
        </div>
        <p>&copy; 2025 Kape Kalakal. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default AboutUs;
