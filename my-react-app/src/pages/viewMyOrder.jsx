import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useLoaderData, redirect } from 'react-router-dom';
import customFetch from '../../../utils/customFetch';
import { toast } from 'react-toastify';

// Loader to fetch current user data
export const loader = async () => {
  try {
    const { data } = await customFetch.get('/users/current-user');
    if (!data) throw new Error("User not found");
    return data;
  } catch (error) {
    return redirect('/');
  }
};

const ViewMyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useLoaderData();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await fetch('http://localhost:5200/api/v1/orders/my-orders', {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Failed to fetch your orders');

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error('Error fetching my orders:', err);
      }
    };

    fetchMyOrders();
  }, []);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const logoutUser = async () => {
    try {
      await customFetch.get('/auth/logout');
      navigate('/login');
      toast.success('Logging out...');
    } catch (error) {
      toast.error('An error occurred while logging out.');
    }
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
  };

  const handlePayNow = async (order) => {
    try {
      const response = await customFetch.post(`/orders/${order._id}/pay`, {
        method: order.paymentMethod, // e.g. 'PayPal' or 'GCash'
      });

      toast.success('Payment successful!');
      setOrders((prev) =>
        prev.map((o) => (o._id === order._id ? { ...o, paymentStatus: 'Paid' } : o))
      );
      closeOrderModal();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    }
  };

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      color: 'white',
      fontSize: '1rem',
      fontWeight: 'bold',
      textDecoration: 'none',
      padding: '5px 10px',
      ...(isActive ? { color: '#ffd700' } : {}),
    };
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <div style={{ backgroundColor: '#5a3b22', width: '100%', height: '70px', position: 'fixed', top: 0, zIndex: 1000 }}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', fontFamily: "'Playfair Display', serif" }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/images/kape.jpg"
              alt="Logo"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                marginRight: '10px',
              }}
            />
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>Kape Kalakal</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/dashboard" style={getLinkStyle('/dashboard')}>HOME</Link>
            <Link to="/aboutus" style={getLinkStyle('/aboutus')}>ABOUT US</Link>
            <Link to="/viewMyOrder" style={getLinkStyle('/viewMyOrder')}>MY ORDERS</Link>
            <Link to="/menu" style={getLinkStyle('/menu')}>PRODUCTS</Link>
            <Link to="/settings" style={getLinkStyle('/settings')}>SETTINGS</Link>
            <div style={{ position: 'relative', cursor: 'pointer', marginTop: '6px' }} onClick={toggleDropdown}>
              <button style={{ backgroundColor: 'transparent', border: 'none', color: 'white', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span>{user?.name}</span>
                <span>▼</span>
              </button>
              <div style={{
                position: 'absolute',
                top: '100%',
                right: '0',
                backgroundColor: '#5a3b22',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '5px',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                display: isDropdownOpen ? 'block' : 'none',
                zIndex: 10,
                minWidth: '120px',
              }}>
                <div
                  style={{ padding: '5px 10px', cursor: 'pointer', textAlign: 'center' }}
                  onClick={() => navigate('/profile')}
                >
                  Profile
                </div>
                <div
                  style={{ padding: '5px 10px', cursor: 'pointer', textAlign: 'center' }}
                  onClick={logoutUser}
                >
                  Logout
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ padding: '140px 5vw 40px', textAlign: 'center', backgroundColor: '#2c1b0b', color: 'white', flex: 1 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem' }}>My Orders</h2>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', fontFamily: "'Playfair Display', serif" }}>
            <thead>
              <tr>
                <th style={headerStyle}>Order ID</th>
                <th style={headerStyle}>Date</th>
                <th style={headerStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td style={cellStyle}>{order._id}</td>
                  <td style={cellStyle}>{new Date(order.createdAt).toLocaleString()}</td>
                  <td style={cellStyle}>
                    <button
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#8c6239',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                      }}
                      onClick={() => openOrderModal(order)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {selectedOrder && (
        <div style={modalBackdropStyle} onClick={closeOrderModal}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Order Details</h3>

            <p style={{ marginBottom: '10px' }}><strong>Order ID:</strong> {selectedOrder._id}</p>
            <p style={{ marginBottom: '10px' }}><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
            <p style={{ marginBottom: '10px' }}><strong>Items:</strong></p>
            <ul style={{ marginBottom: '10px', paddingLeft: '20px' }}>
              {selectedOrder.items.map((item, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  {item.name} — {item.quantity} × ₱{item.price.toFixed(2)}
                </li>
              ))}
            </ul>
            <p style={{ marginBottom: '10px' }}><strong>Subtotal:</strong> ₱{selectedOrder.subtotal.toFixed(2)}</p>
            <p style={{ marginBottom: '10px' }}><strong>Delivery Fee:</strong> ₱{selectedOrder.deliveryFee.toFixed(2)}</p>
            <p style={{ marginBottom: '10px' }}><strong>Total:</strong> ₱{selectedOrder.total.toFixed(2)}</p>
            <p style={{ marginBottom: '10px' }}><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
            <p style={{ marginBottom: '10px' }}><strong>Address:</strong> {selectedOrder.address}</p>
            <p style={{ marginBottom: '20px' }}><strong>Payment Status:</strong> {selectedOrder.paymentStatus || 'Unpaid'}</p>
            <p style={{ marginBottom: '20px' }}><strong>Status:</strong> {selectedOrder.deliveryStatus}</p>

            {selectedOrder.paymentStatus !== 'Paid' && (
              <button
                onClick={() => handlePayNow(selectedOrder)}
                style={{
                  marginTop: '10px',
                  padding: '10px 18px',
                  backgroundColor: '#228B22',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '1.1rem',
                }}
              >
                Pay Now
              </button>
            )}

            <button
              onClick={closeOrderModal}
              style={{
                marginTop: '10px',
                padding: '10px 18px',
                backgroundColor: '#5a3b22',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1.1rem',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const headerStyle = {
  padding: '12px',
  backgroundColor: '#4b2e15',
  color: 'white',
  border: '1px solid #8c6239',
};

const cellStyle = {
  padding: '10px',
  border: '1px solid #8c6239',
};

const modalBackdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1001,
};

const modalContentStyle = {
  backgroundColor: '#4b2e15',
  color: 'white',
  padding: '30px',
  borderRadius: '10px',
  width: '90%',
  maxWidth: '600px',
  maxHeight: '90vh',
  overflowY: 'auto',
  fontFamily: "'Playfair Display', serif",
  fontSize: '1.1rem',
  lineHeight: '1.6',
};

export default ViewMyOrder;
