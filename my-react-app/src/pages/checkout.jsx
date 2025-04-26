import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';  // Cart Icon from react-icons

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
    flexWrap: 'wrap',
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
  cartWrapper: {
    position: 'absolute',
    top: '25px',
    right: '10px',
  },
  cartIcon: {
    color: 'white',
    fontSize: '1.5rem',
  },
  cartCount: {
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '50%',
    padding: '5px 10px',
    position: 'absolute',
    top: '5px',
    right: '0',
    fontSize: '0.8rem',
  },
  checkoutContent: {
    padding: '40px 20px',
  },
  orderList: {
    listStyleType: 'none',
    padding: 0,
  },
  orderItem: {
    backgroundColor: '#fff8dc',
    padding: '15px',
    borderRadius: '12px',
    marginBottom: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  orderDetails: {
    marginBottom: '5px',
  },
  totalPrice: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginTop: '20px',
  },
  checkoutButton: {
    backgroundColor: '#4B2E2E',
    color: '#fff',
    fontWeight: 'bold',
    padding: '15px 30px',
    borderRadius: '25px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.3s ease',
    marginTop: '20px',
  },
};

const Checkout = () => {
  const location = useLocation();
  const { orderDetails } = location.state || { orderDetails: [] };  // Get order details from location state

  // Calculate total price
  const totalPrice = orderDetails.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.navbarWrapper}>
        <nav style={styles.navbar}>
          <div style={styles.navLeft}>Kape Kalakal</div>
          <div style={styles.navLinks}>
            <Link to="/dashboard" style={styles.navLink}>HOME</Link>
            <Link to="/aboutus" style={styles.navLink}>ABOUT US</Link>
            <Link to="/menu" style={styles.navLink}>PRODUCTS</Link>
            <Link to="/settings" style={styles.navLink}>SETTINGS</Link>
            <button style={styles.navLink}>LOGOUT</button>
          </div>
          <div style={styles.cartWrapper}>
            <FaShoppingCart style={styles.cartIcon} />
            {orderDetails.length > 0 && <span style={styles.cartCount}>{orderDetails.length}</span>}
          </div>
        </nav>
      </div>

      <div style={styles.checkoutContent}>
        <h2>Your Orders</h2>
        {orderDetails.length === 0 ? (
          <p>No items in your cart</p>
        ) : (
          <ul style={styles.orderList}>
            {orderDetails.map((item, index) => (
              <li key={index} style={styles.orderItem}>
                <div style={styles.orderDetails}>
                  <strong>{item.name}</strong> - {item.size} - x{item.quantity}
                </div>
                <div style={styles.orderDetails}>₱{item.totalPrice}</div>
              </li>
            ))}
          </ul>
        )}
        
        <div style={styles.totalPrice}>
          Total Price: ₱{totalPrice}
        </div>

        <button style={styles.checkoutButton}>Proceed to Payment</button>
      </div>
    </div>
  );
};

export default Checkout;
