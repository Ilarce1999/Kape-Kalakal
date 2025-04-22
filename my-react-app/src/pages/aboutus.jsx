import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

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
  navRight: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
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
  carouselWrapper: {
    marginTop: '40px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    flexDirection: 'column',
  },
  carouselContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  carouselImage: {
    width: '500px',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  arrowButton: {
    backgroundColor: '#4B2E2E',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    fontSize: '1.5rem',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 2,
  },
  leftArrow: {
    left: '-50px',
  },
  rightArrow: {
    right: '-50px',
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

const coffeeImages = [
  { src: '/images/image1.jpg', name: 'Espresso' },
  { src: '/images/image2.jpg', name: 'Cappuccino' },
  { src: '/images/image3.jpg', name: 'Iced Latte' },
  { src: '/images/image4.jpg', name: 'Flat White' },
  { src: '/images/image5.jpg', name: 'Cortado' },
];

const aboutus = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const location = useLocation();

  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? coffeeImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev === coffeeImages.length - 1 ? 0 : prev + 1));
  };

  const getLinkStyle = (path) => ({
    ...styles.burgerMenuItem,
    ...(location.pathname === path ? styles.activeItem : {}),
  });

  return (
    <div>
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
              <Link to="/login" style={getLinkStyle('/login')} onClick={() => setMenuOpen(false)}>LOGOUT</Link>
            </div>
          )}
        </nav>
      </div>

      <div style={{ padding: '40px 30px' }}>
        {/* First Row: Image Left, Text Right */}
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
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
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

        {/* Second Row: Text Left, Image Right */}
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
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
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
  );
};

export default aboutus;
