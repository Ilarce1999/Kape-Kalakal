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
    backgroundColor: '#5a3b22',
    width: '100%',
    height: '70px',
    position: 'fixed',
    top: 0,
    zIndex: 1000,
    fontFamily: "'Playfair Display', serif",
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
    paddingTop: '0',
  },
  navItemsMobile: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '10px',
    backgroundColor: '#5a3b22',
    position: 'absolute',
    top: '70px',
    right: '0',
    width: '100%',
    padding: '10px 20px',
    boxSizing: 'border-box',
    zIndex: 999,
  },
  navItem: {
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'color 0.3s ease, background-color 0.3s ease',
  },
  activeLink: {
    color: '#FFD700',
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
    padding: '60px 20px 40px', // Add top padding to avoid navbar overlap (70px navbar + margin)
    marginTop: '70px', // Push content below fixed navbar
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
    backgroundColor: '#D2B48C',
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.2rem',
    color: '#4B2E19',
    textAlign: 'center',
  },
  menuButton: {
    marginTop: '20px',
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: '#371D10',
    textDecoration: 'none',
    border: '2px solid #8B4513',
    borderRadius: '8px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease, color 0.3s ease',
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
    minWidth: '120px',
  },
  dropdownItem: {
    padding: '5px 10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    color: 'white',
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
    display: 'none', // initially hidden, shown on mobile below
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '30px',
    height: '30px',
    cursor: 'pointer',
    zIndex: 1100, // above nav-items mobile
  },
  bar: {
    height: '3px',
    width: '100%',
    backgroundColor: 'white',
    margin: '4px 0',
    borderRadius: '2px',
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

  // Close mobile menu when navigation occurs
  useEffect(() => {
    setMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

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
          /* Hide default scrollbar for nav items */
          .nav-items::-webkit-scrollbar {
            display: none;
          }
          .nav-items {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }

          /* Hamburger menu show on small screens */
          @media (max-width: 768px) {
            .nav-items {
              display: none !important;
            }
            .nav-items.mobile-show {
              display: flex !important;
              flex-direction: column !important;
              gap: 10px !important;
              margin-top: 10px !important;
              background-color: #5a3b22 !important;
              position: absolute !important;
              top: 70px !important;
              right: 0 !important;
              width: 100% !important;
              padding: 10px 20px !important;
              box-sizing: border-box !important;
              z-index: 999 !important;
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
              aria-label="Toggle menu"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') toggleMobileMenu();
              }}
            >
              <div style={styles.bar}></div>
              <div style={styles.bar}></div>
              <div style={styles.bar}></div>
            </div>

            <div
              className={`nav-items ${mobileMenuOpen ? 'mobile-show' : ''}`}
              style={styles.navItems}
            >
              <Link to="/dashboard" style={getLinkStyle('/dashboard')}>
                HOME
              </Link>
              <Link to="/aboutus" style={getLinkStyle('/aboutus')}>
                ABOUT US
              </Link>
              <Link to="/viewMyOrder" style={getLinkStyle('/viewMyOrder')}>
                MY ORDERS
              </Link>
              <Link to="/menu" style={getLinkStyle('/menu')}>
                PRODUCTS
              </Link>
              <Link to="/settings" style={getLinkStyle('/settings')}>
                SETTINGS
              </Link>
              <div style={styles.dropdown} onClick={toggleDropdown}>
                <button style={styles.dropdownButton} aria-haspopup="true" aria-expanded={isDropdownOpen}>
                  <span>{user?.name}</span>
                  <span style={{ marginLeft: '5px' }}>▼</span>
                </button>
                <div
                  style={{
                    ...styles.dropdownMenu,
                    ...(isDropdownOpen ? styles.dropdownShow : {}),
                  }}
                >
                  <div
                    style={styles.dropdownItem}
                    onClick={() => navigate('/profile')}
                    role="menuitem"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') navigate('/profile');
                    }}
                  >
                    Profile
                  </div>
                  <div
                    style={styles.dropdownItem}
                    onClick={logoutUser}
                    role="menuitem"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') logoutUser();
                    }}
                  >
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
        <Outlet />
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
