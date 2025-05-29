import React, { useState } from 'react';
import { Link, useNavigate, useLoaderData, redirect } from 'react-router-dom';
import customFetch from '../../../utils/customFetch';
import { toast } from 'react-toastify';

export const loader = async () => {
  try {
    const { data } = await customFetch.get('/orders/my-orders');
    // Always return data (even if empty)
    return data || [];
  } catch (error) {
    // Only redirect if the fetch fails (not just empty orders)
    return redirect('/');
  }
};


const ViewOrder = () => {
  const orders = useLoaderData(); // Get orders data from the loader
  const navigate = useNavigate();

  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleViewOrder = (order) => {
    console.log(order); // Add a console log to check if order data is correctly passed
    setSelectedOrder(order); // Set the selected order for modal view
  };

  const handleCloseOrder = () => {
    setSelectedOrder(null); // Close the order details modal
  };

  const styles = {
    contentWrapper: {
      padding: '40px 30px',
      backgroundColor: '#2c1b0b',
      color: 'white',
      fontFamily: "'Playfair Display', serif",
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    headerSection: {
      width: '100%',
      marginBottom: '40px',
      textAlign: 'center',
    },
    title: {
      fontSize: '2.5rem',
      color: '#FFD700',
      marginBottom: '20px',
      marginTop: '3rem',
      fontWeight: 'bold',
    },
    paragraph: {
      fontSize: '1.2rem',
      lineHeight: '1.8',
      marginBottom: '20px',
    },
    ordersTable: {
      width: '100%',
      marginTop: '0px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      borderRadius: '8px',
      overflow: 'hidden',
      marginBottom: '40px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    tableHeader: {
      backgroundColor: '#5a3b22',
      color: 'white',
      padding: '16px 20px',
      fontSize: '1.2rem',
      textAlign: 'left',
      borderBottom: '2px solid #333',
      textTransform: 'uppercase',
      fontWeight: 'bold',
    },
    tableCell: {
      padding: '14px 20px',
      border: '1px solid #ddd',
      fontSize: '1rem',
      textAlign: 'left',
      backgroundColor: '#ADAEb3',
      color: '#000000',
      wordBreak: 'break-word',
    },
    tableCellBold: {
      fontWeight: 'bold',
    },
    tableRow: {
      transition: 'background-color 0.3s ease',
    },
    tableRowHover: {
      backgroundColor: '#704214',
    },
    viewButton: {
      backgroundColor: '#5a3b22',
      color: 'white',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    viewButtonHover: {
      backgroundColor: '#704214',
    },
    modalBackdrop: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1001,
    },
    modalContent: {
      backgroundColor: '#2c1b0b',
      padding: '20px',
      borderRadius: '8px',
      width: '80%',
      maxWidth: '600px',
      maxHeight: '80vh',
      overflowY: 'auto',
      fontSize: '1rem',
      lineHeight: '1.6',
    },
    modalTitle: {
      fontSize: '1.5rem',
      marginBottom: '15px',
      fontWeight: 'bold',
    },
    closeButton: {
      backgroundColor: '#5a3b22',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginTop: '20px',
      fontSize: '1rem',
    },
    noOrdersText: {
      textAlign: 'left',
      fontSize: '1.5rem',
      color: '#FFD700',
      marginTop: '3.2rem',
      marginBottom: '15px',
    },
    noOrdersButton: {
      marginTop: '0px',
      padding: '12px 25px',
      backgroundColor: '#FFD700',
      color: '#2c1b0b',
      textDecoration: 'none',
      borderRadius: '5px',
      fontSize: '1.2rem',
    },
    noOrdersContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  };

  return (
    <div style={styles.contentWrapper}>
      {/* Only show the Hero Section if orders exist */}
      {orders.length > 0 ? (
        <div style={styles.headerSection}>
          <h3 style={styles.title}>Order History</h3>
        </div>
      ) : (
        <div style={styles.noOrdersContainer}>
          <p style={styles.noOrdersText}>No orders yet!</p>
          <Link to="/menu" style={styles.noOrdersButton}>
            Explore Menu
          </Link>
        </div>
      )}

      {/* Orders List */}
      {orders.length > 0 && (
        <div style={styles.ordersTable}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Order ID'ss</th>
                <th style={styles.tableHeader}>Date</th>
                <th style={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td style={styles.tableCell}>{order._id}</td>
                  <td style={styles.tableCell}>
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td style={styles.tableCell}>
                    <button
                      style={styles.viewButton}
                      onClick={() => handleViewOrder(order)}
                      onMouseOver={(e) => e.target.style.backgroundColor = styles.viewButtonHover.backgroundColor}
                      onMouseOut={(e) => e.target.style.backgroundColor = styles.viewButton.backgroundColor}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div style={styles.modalBackdrop} onClick={handleCloseOrder}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Order Details</h3>
            <p><strong>Order ID:</strong> {selectedOrder._id}</p>
            <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
            <p><strong>Items:</strong></p>
            <ul>
              {selectedOrder.items?.map((item, index) => (
                <li key={index}>
                  {item.name} - {item.quantity} × ₱{item.price?.toFixed(2)}
                </li>
              ))}
            </ul>
            <p><strong>Subtotal:</strong> ₱{selectedOrder.subtotal?.toFixed(2)}</p>
            <p><strong>Delivery Fee:</strong> ₱{selectedOrder.deliveryFee?.toFixed(2)}</p>
            <p><strong>Total:</strong> ₱{selectedOrder.total?.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
            <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus || 'Unpaid'}</p>
            <p><strong>Status:</strong> {selectedOrder.deliveryStatus}</p>
            <button style={styles.closeButton} onClick={handleCloseOrder}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewOrder;
