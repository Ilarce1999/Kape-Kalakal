import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const navigate = useNavigate();

  const handlePayment = () => {
    if (paymentMethod === 'gcash') {
      // Simulate GCash Payment (this should be replaced with actual GCash API integration)
      toast.info('Redirecting to GCash payment gateway...');

      setTimeout(() => {
        // Simulate a successful payment
        toast.success('Payment Successful!');

        // Assuming order details and total price are available (from sessionStorage or props)
        const orderDetails = JSON.parse(sessionStorage.getItem('orderDetails'));
        const totalPrice = sessionStorage.getItem('totalPrice');

        // Store the order in localStorage (this could be a simple array for now)
        const orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
        const newOrder = {
          orderDetails,
          totalPrice,
          date: new Date().toLocaleString(),
        };

        orderHistory.push(newOrder);
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

        // After payment success, redirect to the order history page
        navigate('/order-history');
      }, 2000);
    } else {
      toast.error('Please select a payment method.');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Payment</h2>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="paymentMethod">Choose a payment method:</label>
        <select
          id="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          style={{ padding: '10px', fontSize: '1rem' }}
        >
          <option value="">--Select--</option>
          <option value="gcash">GCash</option>
        </select>
      </div>

      <button
        onClick={handlePayment}
        style={{
          backgroundColor: '#8B4513',
          color: '#fff',
          padding: '14px 22px',
          borderRadius: '25px',
          fontSize: '1.3rem',
          cursor: 'pointer',
          border: 'none',
        }}
      >
        Proceed with Payment
      </button>
    </div>
  );
};

export default Payment;
