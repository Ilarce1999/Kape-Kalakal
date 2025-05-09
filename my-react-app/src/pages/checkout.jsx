import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { state } = useLocation();
  const { orderDetails } = state || {};
  const [orderSummary, setOrderSummary] = useState([]);
  const navigate = useNavigate();

  const DELIVERY_FEE = 50.00;

  useEffect(() => {
    if (orderDetails) {
      setOrderSummary(orderDetails);
    }
  }, [orderDetails]);

  const handleRemoveFromCart = (productId) => {
    const updatedCart = orderSummary.filter((item) => item.productId !== productId);
    setOrderSummary(updatedCart);
    localStorage.setItem('orderDetails', JSON.stringify(updatedCart));
  };

  const calculateSubtotal = () => {
    return orderSummary.reduce((acc, item) => acc + item.totalPrice, 0);
  };

  const handleCheckout = async () => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('authToken'); // Ensure this is the correct key
  
    // Debug log to check the value of token
    console.log('Token retrieved:', token);
  
    if (!token) {
      alert('You must be logged in to place an order.');
      return;
    }
  
    // Log the headers to verify the token
    console.log('Headers:', {
      'Authorization': `Bearer ${token}`, // Log the Authorization header
    });
  
    // Calculate subtotal and total
    const subtotal = calculateSubtotal();
    const total = subtotal + DELIVERY_FEE;
  
    const userId = localStorage.getItem('userId') || 'guest'; // Adjust if you have auth
    const userEmail = localStorage.getItem('email') || 'unknown';
  
    const orderPayload = {
      userId,
      email: userEmail,
      items: orderSummary,
      subtotal,
      deliveryFee: DELIVERY_FEE,
      total,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
  
    try {
      // Perform the API call to place the order
      const response = await fetch('http://localhost:5200/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 👈 this sends cookies
        body: JSON.stringify(orderPayload),
      });
      
  
      if (response.ok) {
        alert('Order placed successfully!');
        localStorage.removeItem('orderDetails');
        navigate('/menu');
      } else {
        alert('Failed to place order');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred while placing the order.');
    }
  };  
  
  
  const handleBackToMenu = () => {
    navigate('/menu');
  };

  const subtotal = calculateSubtotal();
  const total = subtotal + DELIVERY_FEE;

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Receipt Summary</h2>
      {orderSummary.length > 0 ? (
        <div className="receipt-box">
          <ul className="order-list">
            {orderSummary.map((item, index) => (
              <li key={index} className="order-item">
                <div className="item-details">
                  <div>{item.name} ({item.size})</div>
                  <div>{item.quantity} x ₱{item.price.toFixed(2)}</div>
                  <div>= ₱{item.totalPrice.toFixed(2)}</div>
                </div>
                <button className="remove-button" onClick={() => handleRemoveFromCart(item.productId)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="receipt-totals">
            <div className="subtotal-row">
              <span>Subtotal:</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            <div className="subtotal-row">
              <span>Delivery Fee:</span>
              <span>₱{DELIVERY_FEE.toFixed(2)}</span>
            </div>
            <hr />
            <div className="total-row">
              <strong>Total:</strong>
              <strong>₱{total.toFixed(2)}</strong>
            </div>
          </div>

          <button className="checkout-button" onClick={handleCheckout}>Place Order</button>
        </div>
      ) : (
        <p className="empty-cart">No items in the cart</p>
      )}

      <button className="back-button" onClick={handleBackToMenu}>Back to Menu</button>

      <style jsx>{`
        .checkout-container {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
          font-family: Arial, sans-serif;
        }

        .checkout-title {
          font-size: 2rem;
          text-align: center;
          margin-bottom: 20px;
        }

        .receipt-box {
          background: #fff;
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .order-list {
          list-style: none;
          padding: 0;
          margin: 0 0 20px;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #ddd;
          padding: 10px 0;
        }

        .item-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
          color: #333;
        }

        .remove-button {
          background-color: #e74c3c;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
        }

        .remove-button:hover {
          background-color: #c0392b;
        }

        .receipt-totals {
          margin-top: 20px;
          font-size: 1rem;
        }

        .subtotal-row,
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .total-row {
          font-size: 1.2rem;
          font-weight: bold;
        }

        .checkout-button {
          margin-top: 20px;
          width: 100%;
          padding: 12px;
          background-color: #5a3b22;
          color: white;
          border: none;
          font-size: 1rem;
          border-radius: 5px;
          cursor: pointer;
        }

        .checkout-button:hover {
          background-color: #3e2715;
        }

        .back-button {
          margin-top: 20px;
          width: 100%;
          padding: 10px;
          background-color: #8B4513;
          color: white;
          border: none;
          font-size: 1rem;
          border-radius: 5px;
          cursor: pointer;
        }

        .back-button:hover {
          background-color: #5a2e0e;
        }

        .empty-cart {
          text-align: center;
          color: #666;
          font-size: 1.1rem;
        }
      `}</style>
    </div>
  );
};

export default Checkout;
