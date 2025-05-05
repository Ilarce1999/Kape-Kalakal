import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const Menu = ({ user, logoutUser }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(() => {
    const savedOrders = localStorage.getItem('orderDetails');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const totalItems = orderDetails.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = orderDetails.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleCartClick = () => {
    if (orderDetails.length === 0) {
      localStorage.removeItem('orderDetails');
    } else {
      localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
    }
    navigate('/checkout', { state: { orderDetails, totalPrice } });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleOrder = (product) => {
    const existingOrder = orderDetails.find(item => item.productId === product._id);
    let updatedOrders;

    if (existingOrder) {
      updatedOrders = orderDetails.map(item =>
        item.productId === product._id
          ? {
              ...item,
              quantity: item.quantity + 1,
              totalPrice: (item.quantity + 1) * product.price
            }
          : item
      );
    } else {
      updatedOrders = [
        ...orderDetails,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          totalPrice: product.price
        }
      ];
    }

    setOrderDetails(updatedOrders);
    localStorage.setItem('orderDetails', JSON.stringify(updatedOrders));
  };

  const logoutHandler = () => {
    // Clear user data from localStorage or sessionStorage (depending on how user is authenticated)
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login');
    // Call the logout function if it is passed in as a prop
    if (logoutUser) {
      logoutUser();
    }
  };

  const styles = {
    fontFamily: "'Playfair Display', serif",
    color: 'white',
    fontWeight: 'bold',
    pageWrapper: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#2c1b0b',
      fontFamily: "'Playfair Display', serif",
      color: 'white',
      fontWeight: 'bold',
    },
    navbarWrapper: { backgroundColor: '#5a3b22', borderBottom: '1px solid #ddd' },
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '80px',
      padding: '0 20px',
    },
    navLeft: { display: 'flex', alignItems: 'center' },
    logo: { 
      height: '40px', 
      width: '40px', // Added width to make it a circle
      marginRight: '10px', 
      borderRadius: '50%' // Make the logo circular
    },
    navRight: { display: 'flex', alignItems: 'center', gap: '30px' },
    navLink: {
      textDecoration: 'none',
      color: 'white',
      fontWeight: 'bold',
      fontFamily: "'Playfair Display', serif",
    },
    activeLink: { color: '#ffd700' },
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
    cartWrapper: { position: 'relative', cursor: 'pointer' },
    cartIcon: { fontSize: '20px', color: 'white' },
    cartCount: {
      position: 'absolute',
      top: '-5px',
      right: '-10px',
      backgroundColor: 'red',
      color: 'white',
      borderRadius: '50%',
      padding: '2px 6px',
      fontSize: '12px',
    },
    footer: {
      backgroundColor: '#5a3b22',
      padding: '20px 0',
      borderTop: '1px solid #ddd',
      textAlign: 'center',
      marginTop: 'auto',
      fontFamily: "'Playfair Display', serif",
    },
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.navbarWrapper}>
        <nav style={styles.navbar}>
          <div style={styles.navLeft}>
            <img src="/images/kape.jpg" alt="Logo" style={styles.logo} />
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 'bold', color: 'white' }}>Kape Kalakal</span>
          </div>
          <div style={styles.navRight}>
            <Link to="/dashboard" style={styles.navLink}>HOME</Link>
            <Link to="/aboutus" style={styles.navLink}>ABOUT US</Link>
            <NavLink
              to="/menu"
              style={({ isActive }) =>
                isActive ? { ...styles.navLink, ...styles.activeLink } : styles.navLink
              }
            >
              PRODUCTS
            </NavLink>
            <Link to="/settings" style={styles.navLink}>SETTINGS</Link>
            <div style={styles.dropdown} onClick={toggleDropdown}>
              <button style={styles.dropdownButton}>
                <span>{user?.name || 'User'}</span> {/* Shows 'Guest' if user name is not found */}
                <span style={styles.icon}>▼</span>
              </button>
              <div
                style={{
                  ...styles.dropdownMenu,
                  ...(isDropdownOpen ? styles.dropdownShow : {}),
                }}
              >
                <div style={styles.dropdownItem} onClick={logoutHandler}>Logout</div>
              </div>
            </div>
            <div style={styles.cartWrapper} onClick={handleCartClick}>
              <FaShoppingCart style={styles.cartIcon} />
              {totalItems > 0 && <span style={styles.cartCount}>{totalItems}</span>}
            </div>
          </div>
        </nav>
      </div>

      {/* Product Section */}
      <div style={{ padding: '20px' }}>
        {loading && <p>Loading products...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {products.map(product => (
            <div
              key={product._id}
              style={{
                backgroundColor: '#3e2a1a',
                color: 'white',
                fontFamily: "'Playfair Display', serif",
                fontWeight: 'bold',
                border: '1px solid #aaa',
                borderRadius: '10px',
                padding: '15px',
                margin: '10px',
                width: '250px',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
              }}
            >
              <img
                src={`http://localhost:5200/uploads/${product.image}`}
                alt={product.name}
                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
              />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p><strong>₱{product.price.toFixed(2)}</strong></p>
              <button
                onClick={() => handleOrder(product)}
                style={{
                  padding: '10px 20px',
                  cursor: 'pointer',
                  background: '#ffd700',
                  color: '#333',
                  border: 'none',
                  borderRadius: '5px',
                  fontWeight: 'bold'
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
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

export default Menu;
