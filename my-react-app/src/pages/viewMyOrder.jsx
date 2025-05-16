// ViewMyOrder.jsx
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
        marginRight: '10px', // Adds horizontal space between image and text
      }}
     />
      <span
      style={{
      color: 'white',
      fontWeight: 'bold',
      fontSize: '1.5rem',
      position: 'relative',
      top: '2px', // Slight downward adjustment
     }}
     >
       Kape Kalakal
    </span>
  </div>
            <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/dashboard" style={getLinkStyle('/dashboard')}>HOME</Link>
            <Link to="/aboutus" style={getLinkStyle('/aboutus')}>ABOUT US</Link>
            <Link to="/viewMyOrder" style={getLinkStyle('/viewMyOrder')}>MY ORDERS</Link>
            <Link to="/menu" style={getLinkStyle('/menu')}>PRODUCTS</Link>
            <Link to="/settings" style={getLinkStyle('/settings')}>SETTINGS</Link>
            <div style={{ position: 'relative', cursor: 'pointer', marginTop: '6px' }} onClick={toggleDropdown}>
              <button style={{ backgroundColor: 'transparent', border: 'none', color: 'white', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span>{user?.name }</span>
                <span>▼</span>
              </button>
              <div
                style={{
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
                }}
              >
                <div
                  style={{
                    padding: '5px 10px',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
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
                <th style={headerStyle}>Item Name</th>
             {/* }   <th style={headerStyle}>Size</th> */}
                <th style={headerStyle}>Qty</th>
                <th style={headerStyle}>Price</th>
                <th style={headerStyle}>Subtotal</th>
                <th style={headerStyle}>Delivery</th>
                <th style={headerStyle}>Total</th>
                <th style={headerStyle}>Status</th>
                <th style={headerStyle}>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, orderIdx) => {
                const itemCount = order.items.length;
                return order.items.map((item, itemIdx) => (
                  <tr key={`${orderIdx}-${itemIdx}`}>
                    <td style={cellStyle}>{item.name}</td>
                  {/* }  <td style={cellStyle}>{item.size}</td> */}
                    <td style={cellStyle}>{item.quantity}</td>
                    <td style={cellStyle}>₱{item.price.toFixed(2)}</td>

                    {itemIdx === 0 && (
                      <>
                        <td rowSpan={itemCount} style={cellStyle}>₱{order.subtotal.toFixed(2)}</td>
                        <td rowSpan={itemCount} style={cellStyle}>₱{order.deliveryFee.toFixed(2)}</td>
                        <td rowSpan={itemCount} style={cellStyle}>₱{order.total.toFixed(2)}</td>
                        <td rowSpan={itemCount} style={cellStyle}>{order.status}</td>
                        <td rowSpan={itemCount} style={cellStyle}>{new Date(order.createdAt).toLocaleString()}</td>
                      </>
                    )}
                  </tr>
                ));
              })}
            </tbody>
          </table>
        )}
      </div>
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

export default ViewMyOrder;
