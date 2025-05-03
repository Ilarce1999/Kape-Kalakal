import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../../../utils/customFetch';

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const storedOrderDetails = JSON.parse(sessionStorage.getItem('orderDetails')) || [];
  const storedTotalPrice = parseFloat(sessionStorage.getItem('totalPrice')) || 0;

  const { orderDetails = storedOrderDetails, totalPrice = storedTotalPrice } = state || {};

  const normalizedOrderDetails = (orderDetails || []).map(item => ({
    ...item,
    drinkName: item.drinkName || item.name,
  }));

  const [cartItems, setCartItems] = useState(normalizedOrderDetails);
  const [cartTotal, setCartTotal] = useState(totalPrice);

  useEffect(() => {
    sessionStorage.setItem('orderDetails', JSON.stringify(cartItems));
    sessionStorage.setItem('totalPrice', cartTotal.toString());
  }, [cartItems, cartTotal]);

  const updateCart = (updatedCart) => {
    const newTotal = updatedCart.reduce((sum, item) => sum + item.totalPrice, 0);
    setCartItems(updatedCart);
    setCartTotal(newTotal);
  };

  const fetchLatestOrders = async () => {
    try {
      const response = await customFetch.get('/drinks');
      updateCart(response.data);
    } catch (error) {
      toast.error('Error fetching the latest orders.');
    }
  };

  const handleBackToMenu = () => {
    navigate('/menu', { state: { existingOrder: cartItems } });
  };

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      toast.warn('No items in the cart to pay for.');
      return;
    }

    if (cartItems.some(item => !item._id)) {
      toast.warn('Please finalize your order before paying.');
      return;
    }

    toast.info('Redirecting to GCash payment page...');

    try {
      const responses = await Promise.all(
        cartItems.map(item => {
          const normalizedSize = item.size.charAt(0).toUpperCase() + item.size.slice(1).toLowerCase();
          const payload = {
            drinkName: item.drinkName,
            size: normalizedSize,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
          };
          return customFetch.post('/drinks', payload);
        })
      );

      if (responses.some(res => res.status !== 201)) {
        throw new Error('One or more orders failed');
      }

      const savedItems = responses.map(res => res.data);
      setCartItems(savedItems);
      sessionStorage.setItem('orderDetails', JSON.stringify(savedItems));
      sessionStorage.setItem('totalPrice', cartTotal.toString());

      toast.success('Payment successful!');
      sessionStorage.removeItem('orderDetails');
      sessionStorage.removeItem('totalPrice');
      navigate('/orderHistory');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    }
  };

  const deleteOrderItem = async (index) => {
    const item = cartItems[index];
  
    // If no ID, just remove locally
    if (!item._id) {
      const updatedCart = cartItems.filter((_, i) => i !== index);
      updateCart(updatedCart);
      toast.success('Item removed locally.');
      return;
    }
  
    // Soft delete in backend
    try {
      const response = await customFetch.patch(`/drinks/${item._id}`, {
        isDeleted: true, // You must support this in the backend
      });
  
      if (response.status === 200) {
        const updatedCart = cartItems.filter((_, i) => i !== index);
        updateCart(updatedCart);
  
        if (updatedCart.length === 0) {
          sessionStorage.removeItem('orderDetails');
          sessionStorage.removeItem('totalPrice');
        }
  
        toast.success('Item marked as deleted successfully.');
      } else {
        throw new Error('Failed to soft delete');
      }
    } catch (error) {
      toast.error('Could not delete item.');
    }
  };
  
  
  

  const editOrderItem = async (index) => {
    const item = cartItems[index];
    const newSizeInput = prompt('Enter new size (Small, Medium, Large):', item.size);
    const newQty = parseInt(prompt('Enter new quantity:', item.quantity), 10);
  
    if (!newSizeInput || isNaN(newQty) || newQty < 1) {
      toast.error('Invalid size or quantity.');
      return;
    }
  
    const normalizedSize = newSizeInput.charAt(0).toUpperCase() + newSizeInput.slice(1).toLowerCase();
    const priceEach = item.totalPrice / item.quantity;
    const updatedTotalPrice = priceEach * newQty;
  
    // Update in local cart if not yet saved
    if (!item._id) {
      const updatedCart = [...cartItems];
      updatedCart[index] = {
        ...item,
        size: normalizedSize,
        quantity: newQty,
        totalPrice: updatedTotalPrice,
      };
      updateCart(updatedCart);
      toast.success('Item updated locally.');
      return;
    }
  
    // Update in backend
    try {
      const response = await customFetch.patch(`/drinks/${item._id}`, {
        size: normalizedSize,
        quantity: newQty,
        totalPrice: updatedTotalPrice,
      });
  
      if (response.status === 200) {
        const updatedCart = [...cartItems];
        updatedCart[index] = response.data;
        updateCart(updatedCart);
        toast.success('Item updated successfully.');
      }
    } catch (error) {
      toast.error('Failed to update item.');
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <h1 style={styles.checkoutHeader}>Checkout</h1>

      {cartItems.length > 0 ? (
        <div style={styles.cartContainer}>
          {cartItems.map((item, index) => (
            <div key={index} style={styles.cartItem}>
              <div style={styles.itemDetails}>
                <div style={styles.itemName}>{item.drinkName}</div>
                <div style={styles.itemPrice}>₱{item.totalPrice.toFixed(2)}</div>
                <div>Size: {item.size}</div>
                <div>Quantity: {item.quantity}</div>
              </div>
              <div>
                <button style={styles.deleteButton} onClick={() => deleteOrderItem(index)}>Remove</button>
                <button style={styles.deleteButton} onClick={() => editOrderItem(index)}>Edit</button>
              </div>
            </div>
          ))}
          <div style={styles.totalPriceWrapper}>
            <div>Total Price:</div>
            <div>₱{cartTotal.toFixed(2)}</div>
          </div>
          <button style={styles.paymentButton} onClick={handlePayment}>Pay with GCash</button>
        </div>
      ) : (
        <div style={styles.noItemsMessage}>
          <p>No items in the cart.</p>
        </div>
      )}

      <button style={styles.backButton} onClick={handleBackToMenu}>Back to Menu</button>
    </div>
  );
};

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
    borderBottom: '1px solid #fff',
  },
  itemDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  itemName: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  itemPrice: {
    color: '#D2B48C',
    fontSize: '1.1rem',
  },
  deleteButton: {
    backgroundColor: '#fff',
    color: '#4B2E19',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  totalPriceWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
    fontSize: '1.1rem',
  },
  paymentButton: {
    backgroundColor: '#D2B48C',
    color: '#4B2E2E',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.2rem',
    width: '100%',
    marginTop: '20px',
  },
  backButton: {
    marginTop: '20px',
    backgroundColor: '#4B2E19',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
  },
  noItemsMessage: {
    textAlign: 'center',
    fontSize: '1.2rem',
    marginTop: '30px',
  },
};

export default Checkout;
