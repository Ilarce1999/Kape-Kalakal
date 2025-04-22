// Menu.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const styles = {
  pageWrapper: {
    backgroundColor: '#F5DEB3',
    minHeight: '100vh',
    margin: 0,
    padding: 0,
  },
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
    justifyContent: 'center',
    cursor: 'pointer',
    marginLeft: '20px',
  },
  burgerIcon: {
    width: '30px',
    height: '3px',
    backgroundColor: 'white',
    margin: '4px 0',
    transition: '0.4s',
  },
  burgerMenu: {
    position: 'absolute',
    top: '60px',
    right: 0,
    backgroundColor: '#8B4513',
    color: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '200px',
    display: 'flex',
    flexDirection: 'column',
    padding: '0px',
    zIndex: 1000,
  },
  burgerMenuLink: {
    padding: '10px',
    fontSize: '1.2rem',
    textDecoration: 'none',
    color: 'white',
    textAlign: 'center',
    transition: 'background-color 0.3s ease',
    borderRadius: '10px',
  },
  activeLink: {
    backgroundColor: '#A0522D',
    fontWeight: 'bold',
  },
  dashboardContent: {
    padding: '40px 20px',
  },
  searchWrapper: {
    marginBottom: '30px',
    textAlign: 'right',
  },
  searchInput: {
    padding: '8px',
    fontSize: '1rem',
    width: '100%',
    maxWidth: '400px',
    borderRadius: '25px',
    border: '1px solid #8B4513',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    outline: 'none',
  },
  imageRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  },
  imageCard: {
    flex: '1 1 calc(100% - 40px)',
    maxWidth: '400px',
    textAlign: 'center',
    backgroundColor: '#fff8dc',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  cardImage: {
    width: '100%',
    height: '250px',
    objectFit: 'cover',
    borderRadius: '10px',
  },
  coffeeName: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: '15px 0 5px',
    color: '#4B2E2E',
  },
  description: {
    fontSize: '1rem',
    color: '#333',
  },
  priceTag: {
    backgroundColor: '#8B4513',
    color: '#fff',
    fontWeight: 'bold',
    padding: '10px 20px',
    borderRadius: '20px',
    display: 'inline-block',
    fontSize: '1.2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    width: '50%',
    textAlign: 'center',
  },
  orderButton: {
    backgroundColor: '#4B2E2E',
    color: '#fff',
    fontWeight: 'bold',
    padding: '10px 20px',
    borderRadius: '25px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s ease',
    width: '50%',
    textAlign: 'center',
  },
  orderButtonContainer: {
    marginTop: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '15px',
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

const Menu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  const coffees = [
    {
      name: 'Espresso',
      description: 'A bold and rich shot of pure coffee, perfect for a quick energy boost.',
      price: 120,
      image: '/images/image1.jpg',
    },
    {
      name: 'Cappuccino',
      description: 'A perfect balance of espresso, steamed milk, and foam for a smooth sip.',
      price: 140,
      image: '/images/image2.jpg',
    },
    {
      name: 'Iced Latte',
      description: 'A refreshing cold coffee with milk, perfect for hot days or chill vibes.',
      price: 150,
      image: '/images/image3.jpg',
    },
    {
      name: 'Flat White',
      description: 'A blend of microfoamed milk poured over a single or double shot of espresso.',
      price: 130,
      image: '/images/image4.jpg',
    },
    {
      name: 'Cortado',
      description: 'A popular espresso-based coffee drink that actually originated in Spain',
      price: 150,
      image: '/images/image5.jpg',
    },
    {
      name: 'Americano',
      description: 'An Iced Americano consists of espresso shots poured over ice and mixed with cold water',
      price: 135,
      image: '/images/image6.jpg',
    },
  ];

  const filteredCoffees = coffees.filter((coffee) =>
    coffee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.navbarWrapper}>
        <nav style={styles.navbar}>
          <div style={styles.navLeft}>Kape Kalakal</div>

          <div style={styles.navRight}>
            <div
              style={styles.burgerMenuWrapper}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div style={styles.burgerIcon}></div>
              <div style={styles.burgerIcon}></div>
              <div style={styles.burgerIcon}></div>
            </div>
            {menuOpen && (
              <div style={styles.burgerMenu}>
                <Link to="/" style={{ ...styles.burgerMenuLink, ...(location.pathname === '/' ? styles.activeLink : {}) }} onClick={() => setMenuOpen(false)}>HOME</Link>
                <Link to="/aboutus" style={{ ...styles.burgerMenuLink, ...(location.pathname === '/aboutus' ? styles.activeLink : {}) }} onClick={() => setMenuOpen(false)}>ABOUT US</Link>
                <Link to="/menu" style={{ ...styles.burgerMenuLink, ...(location.pathname === '/menu' ? styles.activeLink : {}) }} onClick={() => setMenuOpen(false)}>MENU</Link>
                <Link to="/settings" style={{ ...styles.burgerMenuLink, ...(location.pathname === '/settings' ? styles.activeLink : {}) }} onClick={() => setMenuOpen(false)}>SETTINGS</Link>
                <Link to="/login" style={{ ...styles.burgerMenuLink, ...(location.pathname === '/login' ? styles.activeLink : {}) }} onClick={() => setMenuOpen(false)}>LOGOUT</Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      <div style={styles.dashboardContent}>
        <div style={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search coffee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.imageRow}>
          {filteredCoffees.length > 0 ? (
            filteredCoffees.map((coffee, index) => (
              <div key={index} style={styles.imageCard}>
                <img src={coffee.image} alt={coffee.name} style={styles.cardImage} />
                <div style={styles.coffeeName}>{coffee.name}</div>
                <p style={styles.description}>{coffee.description}</p>
                <div style={styles.orderButtonContainer}>
                  <button style={styles.orderButton}>Order</button>
                  <div style={styles.priceTag}>₱{coffee.price}</div>
                </div>
              </div>
            ))
          ) : (
            <p>No coffee found.</p>
          )}
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

export default Menu;
