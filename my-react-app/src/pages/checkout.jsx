import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import customFetch from '../../../utils/customFetch'; // Assuming customFetch is set up for API calls

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Retrieving order details and total price from sessionStorage or state
  const storedOrderDetails = JSON.parse(sessionStorage.getItem('orderDetails')) || [];
  const storedTotalPrice = sessionStorage.getItem('totalPrice') || 0;
  const { orderDetails = storedOrderDetails, totalPrice = storedTotalPrice } = state || {};

  // Normalize the order details for uniformity (in case of discrepancies in drinkName)
  const normalizedOrderDetails = (orderDetails || []).map(item => ({
    ...item,
    drinkName: item.drinkName || item.name,
  }));

  const [cartItems, setCartItems] = useState(normalizedOrderDetails);
  const [cartTotal, setCartTotal] = useState(parseFloat(totalPrice));

  // Sync cart items and total price with sessionStorage when they change
  useEffect(() => {
    sessionStorage.setItem('orderDetails', JSON.stringify(cartItems));
    sessionStorage.setItem('totalPrice', cartTotal);
  }, [cartItems, cartTotal]);

  const updateCartStorage = (updatedCart) => {
    const newTotal = updatedCart.reduce((sum, item) => sum + item.totalPrice, 0);
    setCartItems(updatedCart);
    setCartTotal(newTotal);
  };

  // Navigate back to menu with the existing cart items
  const handleBackToMenu = () => {
    navigate('/menu', { state: { existingOrder: cartItems } });
  };

  // Handle payment process
  const handlePayment = async () => {
    if (cartItems.length === 0) {
      toast.warn('No items in the cart to pay for.');
      return;
    }

    toast.info('Redirecting to GCash payment page...');

    setTimeout(async () => {
      try {
        const responses = await Promise.all(
          cartItems.map(item => {
            return customFetch.post('/drinks', {
              drinkName: item.drinkName,
              size: item.size,
              quantity: item.quantity,
              totalPrice: item.totalPrice,
            });
          })
        );

        const failed = responses.find(res => res.status !== 201);
        if (failed) throw new Error('One or more drink orders failed');

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

  // Delete an order item from the cart
  const deleteOrderItem = async (index) => {
    const itemToDelete = cartItems[index];

    // If the item doesn't have an _id, it's an unsaved item
    if (!itemToDelete._id) {
      const updatedCart = cartItems.filter((_, i) => i !== index);
      updateCartStorage(updatedCart);
      toast.success('Unsaved item removed from cart.');
      return;
    }

    try {
      // Remove item from database (if it has _id)
      const response = await customFetch.delete(`/drinks/${itemToDelete._id}`);
      if (response.status === 200) {
        // Update local cart if deletion is successful
        const updatedCart = cartItems.filter((_, i) => i !== index);
        updateCartStorage(updatedCart);
        toast.success('Item removed successfully');
      } else {
        throw new Error('Failed to delete item from database');
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
      toast.error('Failed to remove item from cart.');
    }
  };

  // Edit an order item (size and quantity)
  const editOrderItem = async (index) => {
    const item = cartItems[index];

    const newSize = prompt('Enter new size (Small/Medium/Large):', item.size);
    const newQuantity = parseInt(prompt('Enter new quantity:', item.quantity), 10);

    if (!newSize || isNaN(newQuantity) || newQuantity < 1) {
      toast.error('Invalid input');
      return;
    }

    const pricePerItem = item.totalPrice / item.quantity;

    const updatedItem = {
      drinkName: item.drinkName,
      size: newSize,
      quantity: newQuantity,
      totalPrice: pricePerItem * newQuantity,
    };

    if (!item._id) {
      // If the item doesn't have an _id (unsaved), update locally
      const updatedCart = [...cartItems];
      updatedCart[index] = { ...item, ...updatedItem };
      updateCartStorage(updatedCart);
      toast.success('Unsaved item updated locally');
      return;
    }

    try {
      const response = await customFetch.patch(`/drinks/${item._id}`, updatedItem);
      const updatedCart = [...cartItems];
      updatedCart[index] = response.data;
      updateCartStorage(updatedCart);
      toast.success('Item updated successfully');
    } catch (error) {
      console.error('Failed to update item:', error);
      toast.error('Failed to update item in cart.');
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

          <button style={styles.paymentButton} onClick={handlePayment}>
            Pay with GCash
          </button>
        </div>
      ) : (
        <div style={styles.noItemsMessage}><p>No items in the cart.</p></div>
      )}

      <button style={styles.backButton} onClick={handleBackToMenu}>
        Back to Menu
      </button>
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
    borderBottom: '1px solid #ddd',
    fontSize: '1.2rem',
  },
  itemDetails: {
    display: 'flex',
    gap: '10px',
    flexDirection: 'column',
  },
  itemName: {
    fontWeight: 'bold',
    color: '#F5DEB3',
  },
  itemPrice: {
    fontSize: '1.2rem',
    color: '#fff',
  },
  totalPriceWrapper: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    color: '#F5DEB3',
  },
  checkoutButton: {
    backgroundColor: '#8B4513',
    color: '#fff',
    padding: '14px 22px',
    borderRadius: '25px',
    fontSize: '1.3rem',
    cursor: 'pointer',
    border: 'none',
    marginTop: '30px',
    display: 'block',
    width: '100%',
    maxWidth: '300px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  noItemsMessage: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#4B2E2E',
  },
  backButton: {
    backgroundColor: '#F5DEB3',
    color: '#4B2E2E',
    padding: '14px 22px',
    borderRadius: '25px',
    fontSize: '1.3rem',
    cursor: 'pointer',
    border: 'none',
    marginTop: '20px',
    display: 'block',
    width: '100%',
    maxWidth: '300px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  deleteButton: {
    backgroundColor: '#6E260E',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    border: 'none',
    marginRight: '10px',
  },
  paymentButton: {
    backgroundColor: '#3B5998',
    color: '#fff',
    padding: '14px 22px',
    borderRadius: '25px',
    fontSize: '1.3rem',
    cursor: 'pointer',
    border: 'none',
    marginTop: '20px',
    display: 'block',
    width: '100%',
    maxWidth: '300px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
};

export default Checkout;
