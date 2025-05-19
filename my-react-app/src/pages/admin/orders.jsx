import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const headerStyle = {
  padding: '10px 15px',
  textAlign: 'left',
  fontWeight: 'bold',
  fontFamily: "'Playfair Display', serif",
};

const cellStyle = {
  padding: '10px 15px',
  borderBottom: '1px solid #ddd',
  fontFamily: "'Playfair Display', serif",
};

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
        const res = await fetch('http://localhost:5200/api/v1/orders', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

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

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // PATCH to update deliveryStatus or paymentStatus
  const updateOrderStatus = async (field, value) => {
    try {
      const res = await fetch(`http://localhost:5200/api/v1/orders/${selectedOrder._id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
  
      if (res.ok) {
        const updatedOrder = await res.json(); // parse updated order from backend
        setSelectedOrder(updatedOrder);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          )
        );
      } else {
        const errorText = await res.text();
        console.error('Failed to update order:', errorText);
        alert('Failed to update status. See console for details.');
      }
    } catch (error) {
      console.error('Network or fetch error:', error);
      alert('Error updating status.');
    }
  };
  

  return (
    <div
      style={{
        paddingTop: '120px',
        backgroundColor: '#2c1b0b',
        minHeight: '100vh',
        fontFamily: "'Playfair Display', serif",
      }}
    >
      {/* Navbar */}
      <div
        style={{
          backgroundColor: '#5a3b22',
          width: '100%',
          height: '10%',
          position: 'fixed',
          top: 0,
          zIndex: 1000,
          padding: '10px 20px',
        }}
      >
        <nav
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            height: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="/images/kape.jpg"
              alt="Logo"
              style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            />
            <span
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.3rem',
                fontFamily: "'Playfair Display', serif",
              }}
            >
              Kape Kalakal - Admin
            </span>
          </div>

          <div
            className={`nav-items ${isMobileMenuOpen ? 'show' : ''}`}
            style={{ gap: '15px', display: 'flex', alignItems: 'center' }}
          >
            <Link to="/admin" style={getLinkStyle('/admin')}>
              HOME
            </Link>
            <Link to="/admin/products" style={getLinkStyle('/admin/products')}>
              PRODUCTS
            </Link>
            <Link to="/admin/orders" style={getLinkStyle('/admin/orders')}>
              ORDERS
            </Link>

            <div style={{ position: 'relative' }}>
              <button
                onClick={toggleDropdown}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
              >
                {currentUser?.name || 'Admin'} ▼
              </button>
              {isDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    backgroundColor: '#fff',
                    color: '#371D10',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <div style={{ cursor: 'pointer' }} onClick={logoutUser}>
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Orders Table */}
      <div style={{ padding: '40px', color: 'white' }}>
        <h2
          style={{
            marginBottom: '20px',
            fontSize: '1.8rem',
            color: '#FFD700',
            textAlign: 'center',
          }}
        >
          Placed Orders
        </h2>
        {orders.length > 0 ? (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'white',
              color: '#371D10',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#5a3b22', color: 'white' }}>
                <th style={headerStyle}>User Email</th>
                <th style={headerStyle}>Items</th>
                <th style={headerStyle}>Subtotal</th>
                <th style={headerStyle}>Delivery Fee</th>
                <th style={headerStyle}>Total</th>
                <th style={headerStyle}>Delivery Status</th>
                <th style={headerStyle}>Payment Status</th>
                <th style={headerStyle}>Payment Method</th>
                <th style={headerStyle}>Placed At</th>
                <th style={headerStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr
                  key={order._id}
                  style={{
                    backgroundColor: idx % 2 === 0 ? '#fdf6ec' : 'white',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#ffebc1')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#fdf6ec' : 'white')
                  }
                >
                  <td style={cellStyle}>{order.email}</td>
                  <td style={cellStyle}>
                    {order.items.map((item) => (
                      <div key={item.productId} style={{ marginBottom: '4px' }}>
                        {item.name} - {item.quantity} x ₱{item.price.toFixed(2)}
                      </div>
                    ))}
                  </td>
                  <td style={cellStyle}>₱{order.subtotal.toFixed(2)}</td>
                  <td style={cellStyle}>₱{order.deliveryFee.toFixed(2)}</td>
                  <td style={cellStyle}>₱{order.total.toFixed(2)}</td>
                  <td style={cellStyle}>{order.deliveryStatus}</td>
                  <td style={cellStyle}>{order.paymentStatus}</td>
                  <td style={cellStyle}>{order.paymentMethod}</td>
                  <td style={cellStyle}>
                    {new Date(order.createdAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </td>
                  <td style={cellStyle}>
                    <button
                      onClick={() => openModal

                        (order)}
                      style={{
                        backgroundColor: '#371D10',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '5px',
                        cursor: 'pointer',
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
          <p style={{ textAlign: 'center' }}>No orders placed yet.</p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedOrder && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1100,
          }}
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#371D10',
              color: 'white',
              padding: '30px',
              borderRadius: '15px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              fontFamily: "'Playfair Display', serif",
              position: 'relative',
            }}
          >
            <h2
              style={{
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: '20px',
              }}
            >
              Order Details
            </h2>

            <p>
              <strong>User Email:</strong> {selectedOrder.email}
            </p>
            <p>
              <strong>Payment Method:</strong> {selectedOrder.paymentMethod}
            </p>

            <h3>Items:</h3>
            <ul>
              {selectedOrder.items.map((item) => (
                <li key={item.productId}>
                  {item.name} - Quantity: {item.quantity} - Price: ₱{item.price.toFixed(2)}
                </li>
              ))}
            </ul>

            <p>
              <strong>Subtotal:</strong> ₱{selectedOrder.subtotal.toFixed(2)}
            </p>
            <p>
              <strong>Delivery Fee:</strong> ₱{selectedOrder.deliveryFee.toFixed(2)}
            </p>
            <p>
              <strong>Total:</strong> ₱{selectedOrder.total.toFixed(2)}
            </p>

            <div style={{ marginTop: '15px' }}>
              <label htmlFor="deliveryStatus" style={{ fontWeight: 'bold' }}>
                Delivery Status:
              </label>
              <select
                id="deliveryStatus"
                value={selectedOrder.deliveryStatus}
                onChange={(e) => updateOrderStatus('deliveryStatus', e.target.value)}
                style={{
                  marginLeft: '10px',
                  padding: '6px 8px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div style={{ marginTop: '15px' }}>
              <label htmlFor="paymentStatus" style={{ fontWeight: 'bold' }}>
                Payment Status:
              </label>
              <select
                id="paymentStatus"
                value={selectedOrder.paymentStatus}
                onChange={(e) => updateOrderStatus('paymentStatus', e.target.value)}
                style={{
                  marginLeft: '10px',
                  padding: '6px 8px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  fontFamily: "'Playfair Display', serif",
                }}
              >
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>

              </select>
            </div>

            <button
              onClick={closeModal}
              style={{
                marginTop: '25px',
                backgroundColor: '#FFD700',
                color: '#371D10',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
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

export default Orders;