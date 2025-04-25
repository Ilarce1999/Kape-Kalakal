import React, { useState, useEffect } from 'react';
import { Link, useLocation, Form, redirect, useNavigation } from 'react-router-dom';

const styles = {
  navbarWrapper: {
    backgroundColor: '#8B4513',
    width: '100%',
    position: 'fixed',
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
  burgerMenuWrapper: {
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
  },
  burgerIcon: {
    width: '30px',
    height: '3px',
    backgroundColor: 'white',
    margin: '4px 0',
  },
  burgerMenu: {
    position: 'absolute',
    top: '70px',
    right: '30px',
    backgroundColor: '#8B4513',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    padding: '10px',
    zIndex: 1001,
  },
  burgerMenuItem: {
    color: 'white',
    padding: '10px 20px',
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'block',
    borderRadius: '8px',
    transition: 'background-color 0.3s ease',
  },
  activeItem: {
    backgroundColor: '#A0522D',
    fontWeight: 'bold',
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
  heroButtons: {
    position: 'absolute',
    top: '60%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    gap: '20px',
  },
  heroButton: {
    padding: '12px 24px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#8B4513',
    transition: 'background-color 0.3s ease',
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

const heroImages = [
  { src: '/images/welcome1.jpg', text: 'Welcome to Kape Kalakal!' },
  { src: '/images/welcome2.jpg', text: 'Where Coffee Meets Commerce' },
  { src: '/images/welcome3.jpg', text: 'Brewed for Your Success' },
];

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getLinkStyle = (path) => ({
    ...styles.burgerMenuItem,
    ...(location.pathname === path ? styles.activeItem : {}),
  });

  return (
    <div style={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh', backgroundColor: '#F5DEB3' }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={styles.navbarWrapper}>
          <nav style={styles.navbar}>
            <div style={styles.navLeft}>Kape Kalakal</div>
            <div style={styles.burgerMenuWrapper} onClick={() => setMenuOpen(!menuOpen)}>
              <div style={styles.burgerIcon}></div>
              <div style={styles.burgerIcon}></div>
              <div style={styles.burgerIcon}></div>
            </div>
            {menuOpen && (
              <div style={styles.burgerMenu}>
                <Link to="/" style={getLinkStyle('/')} onClick={() => setMenuOpen(false)}>HOME</Link>
                <Link to="/aboutus" style={getLinkStyle('/aboutus')} onClick={() => setMenuOpen(false)}>ABOUT US</Link>
                <Link to="/menu" style={getLinkStyle('/menu')} onClick={() => setMenuOpen(false)}>MENU</Link>
                <Link to="/settings" style={getLinkStyle('/settings')} onClick={() => setMenuOpen(false)}>SETTINGS</Link>
                <Link to="/login" style={getLinkStyle('/')} onClick={() => setMenuOpen(false)}>LOGOUT</Link>
              </div>
            )}
          </nav>
        </div>

        <div style={styles.heroSection}>
          <img src={heroImages[heroIndex].src} alt="hero" style={styles.heroImage} />
          <div style={styles.heroText}>{heroImages[heroIndex].text}</div>
          <div style={styles.heroButtons}>
            <Form method="post" action="/register">
              <button type="submit" style={styles.heroButton}>Register</button>
            </Form>
            <Form method="post" action="/login">
              <button type="submit" style={styles.heroButton}>Login</button>
            </Form>
          </div>
        </div>

        <div style={styles.contentContainer}>
          <div style={styles.box}>
            <img src="/images/box1.jpg" alt="Box 1" style={styles.boxImage} />
            <div style={styles.boxDescription}>
              Discover our premium coffee beans sourced from local farmers, roasted to perfection for your satisfaction.
              <br />
              <Link to="/menu" style={styles.menuButton}>Explore Menu</Link>
            </div>
          </div>
          <div style={styles.box}>
            <img src="/images/welcome1.jpg" alt="Box 2" style={styles.boxImage} />
            <div style={styles.boxDescription}>
              Experience the blend of tradition and innovation in every cup — crafted with love by Kape Kalakal.
              <br />
              <Link to="/menu" style={styles.menuButton}>Browse Options</Link>
            </div>
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
            <div style={styles.footerLinks}>
              <a href="/" style={styles.footerLink}>Home</a>
              <a href="/aboutus" style={styles.footerLink}>About Us</a>
              <a href="/menu" style={styles.footerLink}>Menu</a>
              <a href="/settings" style={styles.footerLink}>Settings</a>
            </div>
            &copy; {new Date().getFullYear()} Kape Kalakal. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
