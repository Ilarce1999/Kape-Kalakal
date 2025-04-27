import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const styles = {
  pageWrapper: {
    padding: '40px',
    fontFamily: "'Playfair Display', serif",
    backgroundColor: '#F5DEB3',
    minHeight: '100vh',
  },
  checkoutHeader: {
    textAlign: 'center',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#4B2E2E',
  },
  cartContainer: {
    backgroundColor: '#4B2E2E',
    padding: '20px',
    borderRadius: '8px',
    color: '#fff',
    maxWidth: '900px',
    margin: '0 auto',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #ddd',
    fontSize: '1.2rem',
  },
  itemDetails: {
    display: 'flex',
    gap: '10px',
    flexDirection: 'column',
  },
  itemName: {
    fontWeight: 'bold',
    color: '#F5DEB3',
  },
  itemPrice: {
    fontSize: '1.2rem',
    color: '#fff',
  },
  totalPriceWrapper: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    color: '#F5DEB3',
  },
  checkoutButton: {
    backgroundColor: '#8B4513',
    color: '#fff',
    padding: '14px 22px',
    borderRadius: '25px',
    fontSize: '1.3rem',
    cursor: 'pointer',
    border: 'none',
    marginTop: '30px',
    display: 'block',
    width: '100%',
    maxWidth: '300px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  noItemsMessage: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#4B2E2E',
  },
  backButton: {
    backgroundColor: '#F5DEB3',
    color: '#4B2E2E',
    padding: '14px 22px',
    borderRadius: '25px',
    fontSize: '1.3rem',
    cursor: 'pointer',
    border: 'none',
    marginTop: '20px',
    display: 'block',
    width: '100%',
    maxWidth: '300px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
};

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const storedOrderDetails = JSON.parse(sessionStorage.getItem('orderDetails')) || [];
  const storedTotalPrice = sessionStorage.getItem('totalPrice') || 0;
  const { orderDetails = storedOrderDetails, totalPrice = storedTotalPrice } = state || {};

  React.useEffect(() => {
    if (orderDetails && orderDetails.length > 0) {
      sessionStorage.setItem('orderDetails', JSON.stringify(orderDetails));
      sessionStorage.setItem('totalPrice', totalPrice);
    }
  }, [orderDetails, totalPrice]);

  const handleBackToMenu = () => {
    navigate('/menu', { state: { existingOrder: orderDetails } });
  };

  return (
    <div style={styles.pageWrapper}>
      <h1 style={styles.checkoutHeader}>Checkout</h1>

      {orderDetails && orderDetails.length > 0 ? (
        <div style={styles.cartContainer}>
          {orderDetails.map((item, index) => (
            <div key={index} style={styles.cartItem}>
              <div style={styles.itemDetails}>
                <div style={styles.itemName}>{item.name}</div>
                <div style={styles.itemPrice}>₱{item.totalPrice}</div>
                <div>Size: {item.size}</div>
                <div>Quantity: {item.quantity}</div>
              </div>
            </div>
          ))}

          <div style={styles.totalPriceWrapper}>
            <div>Total Price:</div>
            <div>₱{totalPrice}</div>
          </div>

          <button style={styles.checkoutButton} onClick={() => alert('Proceeding to payment...')}>
            Proceed to Payment
          </button>
        </div>
      ) : (
        <div style={styles.noItemsMessage}>
          <p>No items in the cart.</p>
        </div>
      )}

      <button style={styles.backButton} onClick={handleBackToMenu}>
        Back to Menu
      </button>
    </div>
  );
};

export default Checkout;
