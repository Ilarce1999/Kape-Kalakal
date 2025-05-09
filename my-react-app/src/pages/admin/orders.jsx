import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Orders = ({ currentUser }) => {
  const [orders, setOrders] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5200/api/v1/orders', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const logoutUser = async () => {
    await fetch('http://localhost:5200/api/v1/auth/logout', { credentials: 'include' });
    navigate('/login');
  };

  const getLinkStyle = (path) => ({
    color: location.pathname === path ? '#FFD700' : 'white',
    fontWeight: 'bold',
    textDecoration: 'none',
    padding: '5px 10px',
    fontFamily: "'Playfair Display', serif",
  });

  const handleViewClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const response = await fetch(`http://localhost:5200/api/v1/orders/${selectedOrder._id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        alert('Order status updated successfully!');
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div style={{ paddingTop: '120px', backgroundColor: '#2c1b0b', minHeight: '100vh', fontFamily: "'Playfair Display', serif" }}>

      {/* Navbar */}
      <div style={{
        backgroundColor: '#5a3b22',
        width: '100%',
        height: '10%',
        position: 'fixed',
        top: 0,
        zIndex: 1000,
        padding: '10px 20px'
      }}>
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          height: '100%',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/images/kape.jpg" alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
            <span style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.3rem',
              fontFamily: "'Playfair Display', serif"
            }}>
              Kape Kalakal - Admin
            </span>
          </div>

         {/* } <button className="hamburger" onClick={toggleMobileMenu}>☰</button> */}

          <div className={`nav-items ${isMobileMenuOpen ? 'show' : ''}`} style={{ gap: '15px', display: 'flex', alignItems: 'center' }}>
            <Link to="/admin" style={getLinkStyle('/admin')}>HOME</Link>
            <Link to="/admin/products" style={getLinkStyle('/admin/products')}>PRODUCTS</Link>
            <Link to="/admin/orders" style={getLinkStyle('/admin/orders')}>ORDERS</Link>

            <div style={{ position: 'relative' }}>
              <button onClick={toggleDropdown} style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '1rem',
                cursor: 'pointer',
              }}>
                {currentUser?.name || 'Admin'} ▼
              </button>
              {isDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  backgroundColor: '#fff',
                  color: '#371D10',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                }}>
                  <div style={{ cursor: 'pointer' }} onClick={logoutUser}>Logout</div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Orders Table */}
      <div style={{ padding: '40px', color: 'white' }}>
        <h2 style={{ marginBottom: '20px', fontSize: '1.8rem', color: '#FFD700' }}>Placed Orders</h2>
        {orders.length > 0 ? (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            color: '#371D10',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <thead>
              <tr>
                <th style={headerStyle}>User Email</th>
                <th style={headerStyle}>Items</th>
                <th style={headerStyle}>Subtotal</th>
                <th style={headerStyle}>Delivery Fee</th>
                <th style={headerStyle}>Total</th>
                <th style={headerStyle}>Status</th>
                <th style={headerStyle}>Placed At</th>
                <th style={headerStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td style={cellStyle}>{order.email}</td>
                  <td style={cellStyle}>
                    <ul style={{ paddingLeft: '20px' }}>
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.name} ({item.size}) - {item.quantity} x ₱{item.price}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td style={cellStyle}>₱{order.subtotal.toFixed(2)}</td>
                  <td style={cellStyle}>₱{order.deliveryFee.toFixed(2)}</td>
                  <td style={cellStyle}>₱{order.total.toFixed(2)}</td>
                  <td style={cellStyle}>{order.status}</td>
                  <td style={cellStyle}>{new Date(order.createdAt).toLocaleString()}</td>
                  <td style={cellStyle}>
                    <button
                      onClick={() => handleViewClick(order)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#FFD700',
                        border: 'none',
                        color: '#371D10',
                        cursor: 'pointer',
                        borderRadius: '5px',
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No orders placed yet.</p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedOrder && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2>Order Details</h2>
            <p>Email: {selectedOrder.email}</p>
            <ul>
              {selectedOrder.items.map((item, idx) => (
                <li key={idx}>{item.name} ({item.size}) - {item.quantity} x ₱{item.price}</li>
              ))}
            </ul>
            <p>Subtotal: ₱{selectedOrder.subtotal.toFixed(2)}</p>
            <p>Delivery Fee: ₱{selectedOrder.deliveryFee.toFixed(2)}</p>
            <p>Total: ₱{selectedOrder.total.toFixed(2)}</p>
            <p>Status: 
              <select
                value={selectedOrder.status}
                onChange={(e) => handleUpdateStatus(e.target.value)}
                style={{ padding: '5px', marginTop: '10px' }}
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </p>
            <button onClick={handleCloseModal} style={modalCloseButtonStyle}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

const headerStyle = {
  padding: '12px',
  border: '1px solid #ddd',
  backgroundColor: '#444',
  color: '#fff',
  textAlign: 'left'
};

const cellStyle = {
  padding: '10px',
  border: '1px solid #ddd'
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1001,
  animation: 'fadeIn 0.3s ease-out',
};

const modalContentStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '12px',
  width: '400px',
  maxWidth: '90%',
  boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
  animation: 'slideUp 0.3s ease-out',
};

const modalCloseButtonStyle = {
  backgroundColor: '#FFD700',
  padding: '10px 20px',
  border: 'none',
  color: '#371D10',
  cursor: 'pointer',
  borderRadius: '5px',
  marginTop: '20px',
  fontWeight: 'bold',
  fontSize: '1rem',
  transition: 'background-color 0.3s',
};

export default Orders;
