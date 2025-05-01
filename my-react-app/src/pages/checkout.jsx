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
  
    // Ensure all items are saved before proceeding
    if (cartItems.some(item => !item._id)) {
      toast.warn('Please finalize your order before paying.');
      return;
    }
  
    toast.info('Redirecting to GCash payment page...');
    
    setTimeout(async () => {
      try {
        const responses = await Promise.all(
          cartItems.map(item => {
            const normalizedSize = item.size.charAt(0).toUpperCase() + item.size.slice(1).toLowerCase();
            return customFetch.post('/drinks', {
              drinkName: item.drinkName,
              size: normalizedSize,
              quantity: item.quantity,
              totalPrice: item.totalPrice,
            });
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
        console.error('Payment error:', error);
        toast.error('Payment failed. Please try again.');
      }
    }, 2000);
  };
  
  

  const deleteOrderItem = async (index) => {
    const item = cartItems[index];
  
    if (!item._id) {
      // If no _id, delete locally (not yet saved to DB)
      const updatedCart = cartItems.filter((_, i) => i !== index);
      updateCart(updatedCart);
      toast.success('Item removed locally.');
      return;
    }
  
    // If item is already saved in DB, delete from DB too
    try {
      const response = await customFetch.delete(`/drinks/${item._id}`);
      if (response.status === 200) {
        const updatedCart = cartItems.filter((_, i) => i !== index);
        updateCart(updatedCart);
        toast.success('Item deleted successfully.');
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
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
  
    const updatedItem = {
      ...item,
      size: normalizedSize,
      quantity: newQty,
      totalPrice: priceEach * newQty,
    };
  
    if (!item._id) {
      // If item is unsaved, just update locally
      const updatedCart = [...cartItems];
      updatedCart[index] = updatedItem;
      updateCart(updatedCart);
      toast.success('Item updated locally.');
      return;
    }
  
    try {
      const response = await customFetch.patch(`/drinks/${item._id}`, updatedItem);
      if (response.status === 200) {
        const updatedCart = [...cartItems];
        updatedCart[index] = response.data;
        updateCart(updatedCart);
        toast.success('Item updated successfully.');
      }
    } catch (error) {
      console.error('Edit error:', error);
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
    color: '#FFD700',
    fontSize: '1.1rem',
  },
  deleteButton: {
    backgroundColor: '#D64D4D',
    color: '#fff',
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
    backgroundColor: '#FFD700',
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
    backgroundColor: '#D64D4D',
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
