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
    backgroundColor: '#5a3b22', // Same as AboutUs navbar background color
    width: '100%',
    height: '70px', // Match the height with AboutUs navbar
    position: 'fixed',
    top: 0,
    zIndex: 1000,
    fontFamily: "'Playfair Display', serif", // Same font family
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    height: '100%',
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
    color: '#FFD700', // Active link color from AboutUs
  },
  heroSection: {
    width: '100%',
    height: '100vh',
    position: 'relative',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'brightness(60%)',
  },
  heroText: {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: 'white',
    fontSize: '4rem',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: "'Playfair Display', serif",
    padding: '0 20px',
  },
  contentContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    flexWrap: 'wrap',
    padding: '60px 20px',
  },
  box: {
    width: '600px',
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
    overflow: 'hidden',
  },
  boxImage: {
    width: '100%',
    height: '360px',
    objectFit: 'cover',
  },
  boxDescription: {
    padding: '30px 25px',
    backgroundColor: '#D2B48C', // Same background as AboutUs content
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.2rem',
    color: '#4B2E19', // Same text color as AboutUs content
    textAlign: 'center',
  },
  menuButton: {
    marginTop: '20px',
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: '#371D10',
    textDecoration: 'none',
    border: '2px solid #8B4513', // Match the border color
    borderRadius: '8px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease, color 0.3s ease',
  },
  footer: {
    backgroundColor: '#5a3b22', // Same as AboutUs footer background color
    color: 'white',
    textAlign: 'center',
    padding: '20px 0',
    fontSize: '0.9rem',
    fontFamily: "'Playfair Display', serif",
    marginTop: '40px',
  },
  dropdown: {
    position: 'relative',
    cursor: 'pointer',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    right: '0',
    backgroundColor: '#5a3b22',
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
    color:'white',
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
  hamburger: {
    display: 'none',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '30px',
    height: '30px',
    cursor: 'pointer',
  },
  bar: {
    height: '3px',
    width: '100%',
    backgroundColor: 'white',
    margin: '4px 0',
    borderRadius: '2px',
  },
  navItemsMobile: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '10px',
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
};

const heroImages = [
  { src: '/images/welcome1.jpg', text: 'Welcome to Kape Kalakal!' },
  { src: '/images/welcome2.jpg', text: 'Where Coffee Meets Commerce' },
  { src: '/images/welcome3.jpg', text: 'Brewed for Your Success' },
];

export const loader = async () => {
  try {
    const { data } = await customFetch.get('/users/current-user');
    return data;
  } catch (error) {
    return redirect('/');
  }
};

const Dashboard = () => {
  const { user } = useLoaderData();
  const navigate = useNavigate();
  const location = useLocation();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [heroIndex, setHeroIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setToastMessage('Welcome to the dashboard!');
    setToastVisible(true);
    const timer = setTimeout(() => setToastVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getLinkStyle = (path) => {
    const isActive =
      location.pathname === path || (path === '/' && location.pathname === '/');
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div
      style={{
        position: 'relative',
        overflowX: 'hidden',
        minHeight: '100vh',
        backgroundColor: '#2c1b0b',
      }}
    >
      <style>
        {`
          @media (max-width: 768px) {
            .nav-items {
              display: none;
              flex-direction: column;
              width: 100%;
              background-color: #8B4513;
            }
            .nav-items.show {
              display: flex;
            }
            .hamburger {
              display: flex !important;
            }
          }
        `}
      </style>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={styles.navbarWrapper}>
          <nav style={styles.navbar}>
            <div style={styles.navLeft}>
              <img src="/images/kape.jpg" alt="Logo" style={styles.logo} />
              <span style={styles.logoText}>Kape Kalakal</span>
            </div>

            <div
              className="hamburger"
              style={styles.hamburger}
              onClick={toggleMobileMenu}
            >
              <div style={styles.bar}></div>
              <div style={styles.bar}></div>
              <div style={styles.bar}></div>
            </div>

            <div
              className={`nav-items ${mobileMenuOpen ? 'show' : ''}`}
              style={{ ...styles.navItems }}
            >
              <Link to="/dashboard" style={getLinkStyle('/dashboard')}>
                HOME
              </Link>
              <Link to="/aboutus" style={getLinkStyle('/aboutus')}>
                ABOUT US
              </Link>
              <Link to="/menu" style={getLinkStyle('/menu')}>
                PRODUCTS
              </Link>
              <Link to="/settings" style={getLinkStyle('/settings')}>
                SETTINGS
              </Link>
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

        <div style={styles.heroSection}>
          <img
            src={heroImages[heroIndex].src}
            alt="hero"
            style={styles.heroImage}
          />
          <div style={styles.heroText}>{heroImages[heroIndex].text}</div>
        </div>

        <div style={styles.contentContainer}>
          <div style={styles.box}>
            <img src="/images/box1.jpg" alt="Box 1" style={styles.boxImage} />
            <div style={styles.boxDescription}>
              Discover our premium coffee beans sourced from local farmers,
              roasted to perfection for your satisfaction.
              <br />
              <Link to="/menu" style={styles.menuButton}>
                Explore Menu
              </Link>
            </div>
          </div>
          <div style={styles.box}>
            <img
              src="/images/welcome1.jpg"
              alt="Box 2"
              style={styles.boxImage}
            />
            <div style={styles.boxDescription}>
              Experience the blend of tradition and innovation in every cup —
              crafted with love by Kape Kalakal.
              <br />
              <Link to="/menu" style={styles.menuButton}>
                Browse Options
              </Link>
            </div>
          </div>
        </div>

        <footer style={styles.footer}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
              padding: '0 20px',
            }}
          >
            <div style={{ flex: '1 1 250px', margin: '10px' }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
                Customer Service
              </h4>
              <p>Need help? Our team is here for you 24/7.</p>
              <p>FAQs</p>
              <p>Returns & Refunds</p>
              <p>Order Tracking</p>
            </div>
            <div style={{ flex: '1 1 250px', margin: '10px' }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
                Contact Us
              </h4>
              <p>Email: support@kapekalakal.com</p>
              <p>Phone: +63 912 345 6789</p>
              <p>Address: 123 Brew Street, Makati, PH</p>
            </div>
            <div style={{ flex: '1 1 250px', margin: '10px' }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
                About Us
              </h4>
              <p>
                Kape Kalakal is your go-to café for premium Filipino coffee
                blends. We're passionate about coffee and community.
              </p>
              <p>Read Our Story</p>
            </div>
          </div>
          <div style={{ marginTop: '20px' }}>
            <p>© 2025 Kape Kalakal. All Rights Reserved.</p>
          </div>
        </footer>
      </div>

      {toastVisible && (
        <div style={styles.toast}>
          <p>{toastMessage}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
