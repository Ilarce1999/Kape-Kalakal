import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { orderDetails } = state || {};

  const [orderSummary, setOrderSummary] = useState([]);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [clientId, setClientId] = useState(null);

  const DELIVERY_FEE = 50.0;

  useEffect(() => {
    const stored = localStorage.getItem('orderDetails');

    if (Array.isArray(orderDetails) && orderDetails.length > 0) {
      setOrderSummary(orderDetails);
    } else if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOrderSummary(parsed);
        }
      } catch {
        console.error('Invalid localStorage JSON for orderDetails');
      }
    }

    const getClientId = async () => {
      try {
        const response = await fetch('/api/v1/payments');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setClientId(data.clientId);
      } catch (error) {
        console.error('Failed to fetch PayPal Client ID:', error);
      }
    };

    getClientId();
  }, [orderDetails]);

  const calculateSubtotal = () =>
    orderSummary.reduce((acc, item) => acc + (item.totalPrice || 0), 0);

  const subtotal = calculateSubtotal();
  const total = subtotal + DELIVERY_FEE;

  const handleRemoveFromCart = (productId) => {
    const updatedCart = orderSummary.filter(item => {
      // Use either productId or _id (depending on your data)
      const id = item.productId || item._id;
      return id !== productId;
    });
    setOrderSummary(updatedCart);
    localStorage.setItem('orderDetails', JSON.stringify(updatedCart));
  };

  const handleBackToMenu = () => navigate('/menu');

  const handleCheckout = async () => {
    if (!address.trim() || !paymentMethod.trim()) {
      alert('Please fill in both the address and payment method.');
      return;
    }
    if (paymentMethod === 'Paypal') return; // PayPal handled separately
    await placeOrder('Manual');
  };

  const placeOrder = async (paymentSource) => {
    const token = localStorage.getItem('authToken');
    const email = localStorage.getItem('email') || 'unknown';
    const userId = localStorage.getItem('userId'); // Assuming you store userId on login

    // Map orderSummary to match your schema items
    const itemsPayload = orderSummary.map(item => ({
      productId: item.productId || item._id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      totalPrice: item.totalPrice,
    }));

    const payload = {
      userId,
      email,
      items: itemsPayload,
      address,
      paymentMethod,
      subtotal,
      deliveryFee: DELIVERY_FEE,
      total,
      paymentStatus: paymentSource === 'PayPal' ? 'Paid' : 'Unpaid',
      deliveryStatus: 'Pending',
    };

    try {
      const res = await fetch('http://localhost:5200/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        alert('Order placed successfully!');
        localStorage.removeItem('orderDetails');
        navigate('/menu');
      } else {
        alert(`Failed to place order: ${result.msg || 'Server error'}`);
      }
    } catch (error) {
      console.error('Order placement failed:', error);
      alert('An error occurred while placing the order.');
    }
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Receipt Summary</h2>

      {orderSummary.length > 0 ? (
        <div className="receipt-box">
          <ul className="order-list">
            {orderSummary.map((item) => {
              const id = item.productId || item._id;
              return (
                <li key={id} className="order-item">
                  <div className="item-details">
                    <div>{item.name}</div>
                    <div>{item.quantity} x ₱{item.price.toFixed(2)}</div>
                    <div>= ₱{item.totalPrice.toFixed(2)}</div>
                  </div>
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveFromCart(id)}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="form-section">
            <label>
              Address:
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter delivery address"
                required
              />
            </label>

            <label>
              Payment Method:
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
              >
                <option value="">Select Payment Method</option>
                <option value="COD">COD</option>
                <option value="GCash">GCash</option>
                <option value="PayPal">Paypal</option>
              </select>
            </label>
          </div>

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

          {paymentMethod === 'PayPal' && clientId && (
            <PayPalScriptProvider options={{ 'client-id': clientId }}>
              <div style={{ marginTop: '20px' }}>
                <PayPalButtons
                  style={{ layout: 'vertical', color: 'gold', shape: 'pill' }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [{
                        amount: {
                          value: total.toFixed(2),
                        },
                      }],
                    });
                  }}
                  onApprove={async (data, actions) => {
                    await actions.order.capture();
                    await placeOrder('PayPal');
                    
                  }}
                  onError={(err) => {
                    console.error('PayPal error:', err);
                    alert('There was an issue with PayPal payment.');
                  }}
                />
              </div>
            </PayPalScriptProvider>
          )}

          {paymentMethod !== 'PayPal' && (
            <button className="checkout-button" onClick={handleCheckout}>
              Place Order
            </button>
          )}
        </div>
      ) : (
        <p className="empty-cart">No items in the cart</p>
      )}

      <button className="back-button" onClick={handleBackToMenu}>
        Back to Menu
      </button>

      <style jsx>{`
         .checkout-container {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
          font-family: 'Segoe UI', sans-serif;
        }
         .checkout-title {
          text-align: center;
          margin-bottom: 20px;
          color: #e0e0e0; /* Light color for Receipt Summary */
        }
        .receipt-box {
          border: 1px solid #ddd;
          padding: 15px;
          border-radius: 5px;
          background-color: #f9f9f9;
        }
        .order-list {
          list-style: none;
          padding: 0;
          margin: 0 0 20px 0;
        }
        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #ccc;
        }
        .item-details > div {
          margin-bottom: 4px;
        }
        .remove-button {
          background-color: #e74c3c;
          color: white;
          border: none;
          padding: 6px 12px;
          cursor: pointer;
          border-radius: 4px;
        }
        .remove-button:hover {
          background-color: #c0392b;
        }
        .form-section label {
          display: block;
          margin-bottom: 10px;
        }
        textarea {
          width: 100%;
          height: 60px;
          padding: 8px;
          resize: vertical;
          font-family: 'Segoe UI', sans-serif;
          font-size: 14px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        select {
          width: 100%;
          padding: 8px;
          font-family: 'Segoe UI', sans-serif;
          font-size: 14px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .receipt-totals {
          margin-top: 20px;
        }
        .subtotal-row,
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
        }
        hr {
          margin: 10px 0;
          border: none;
          border-top: 1px solid #ccc;
        }
        .checkout-button {
          margin-top: 20px;
          width: 100%;
          padding: 12px;
          background-color: #27ae60;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
        }
        .checkout-button:hover {
          background-color: #219150;
        }
        .back-button {
          margin-top: 15px;
          width: 100%;
          padding: 10px;
          background-color: #696969;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 15px;
          cursor: pointer;
        }
        .back-button:hover {
          background-color: #808080;
        }
         .empty-cart {
          text-align: center;
          font-size: 18px;
          color: #e0e0e0; /* Light color for No items in the cart */
          margin: 20px 0;
  }
      `}</style>
    </div>
  );
};

export default Checkout;
