import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
  const navigate = useNavigate();
  const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];

  return (
    <div style={styles.pageWrapper}>
      <h2 style={styles.heading}>Order History</h2>

      {orderHistory.length > 0 ? (
        orderHistory.map((order, index) => (
          <div key={index} style={styles.orderCard}>
            <h3 style={styles.orderTitle}>Order {index + 1} - {order.date}</h3>
            <div>
              <h4 style={styles.itemsHeading}>Items:</h4>
              {order.orderDetails.map((item, i) => (
                <div key={i} style={styles.itemDetails}>
                  <p style={styles.itemText}>{item.name} - ₱{item.totalPrice}</p>
                </div>
              ))}
            </div>
            <div style={styles.totalPriceWrapper}>
              <strong style={styles.totalPrice}>Total Price: ₱{order.totalPrice}</strong>
            </div>
          </div>
        ))
      ) : (
        <p style={styles.noOrdersText}>No orders found.</p>
      )}

      <button
        onClick={() => navigate('/menu')}
        style={styles.backButton}
      >
        Back to Menu
      </button>
    </div>
  );
};

const styles = {
  pageWrapper: {
    padding: '20px',
    textAlign: 'center',
    fontFamily: "'Playfair Display', serif",
    backgroundColor: '#f4f4f4',
    minHeight: '100vh',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#4B2E2E',
  },
  orderCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    textAlign: 'left',
    border: '1px solid #ddd',
  },
  orderTitle: {
    fontSize: '1.5rem',
    color: '#4B2E2E',
    marginBottom: '10px',
  },
  itemsHeading: {
    fontSize: '1.2rem',
    color: '#8B4513',
    marginBottom: '10px',
  },
  itemDetails: {
    padding: '5px 0',
    borderBottom: '1px solid #ddd',
  },
  itemText: {
    fontSize: '1rem',
    color: '#4B2E2E',
  },
  totalPriceWrapper: {
    marginTop: '15px',
  },
  totalPrice: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#8B4513',
  },
  noOrdersText: {
    fontSize: '1.2rem',
    color: '#4B2E2E',
    marginTop: '20px',
  },
  backButton: {
    backgroundColor: '#8B4513',
    color: '#fff',
    padding: '14px 22px',
    borderRadius: '25px',
    fontSize: '1.3rem',
    cursor: 'pointer',
    border: 'none',
    marginTop: '30px',
    transition: 'background-color 0.3s',
    width: '100%',
    maxWidth: '300px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
};

export default OrderHistory;
