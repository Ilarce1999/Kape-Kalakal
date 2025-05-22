import React, { useEffect, useState } from 'react';
import { useNavigate, useLoaderData } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import customFetch from '../../../utils/customFetch.js';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import styles for toast

export const loader = async () => {
  try {
    const { data } = await customFetch.get('/users/current-user');
    return data;
  } catch (error) {
    return redirect('/');
  }
};

const Menu = ({ logoutUser }) => {
  const navigate = useNavigate();
  const { user } = useLoaderData();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(() => {
    const savedOrders = localStorage.getItem('orderDetails');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalProduct, setModalProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockError, setStockError] = useState('');
  const [quantities, setQuantities] = useState({});

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const totalProducts = orderDetails.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = orderDetails.reduce((acc, item) => acc + item.totalPrice, 0);
  const DELIVERY_FEE = 50;

  const handleCartClick = () => {
    const finalTotalPrice = totalPrice + DELIVERY_FEE;
    if (orderDetails.length === 0) {
      localStorage.removeItem('orderDetails');
    } else {
      localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
    }
    navigate('/checkout', { state: { orderDetails, totalPrice: finalTotalPrice, deliveryFee: DELIVERY_FEE } });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const calculateTotal = (basePrice, quantity) => basePrice * quantity;

  const handleAddToCartClick = (product) => {
    setModalProduct(product);
    setStockError('');
  };

  const confirmAddToCart = async () => {
    if (!modalProduct) return;
    const product = modalProduct;
    const quantity = quantities[product._id] || 1;

    if (product.stock < quantity) {
      setStockError('Insufficient stock available');
      return;
    }

    const newOrder = {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity,
      totalPrice: product.price * quantity,
    };

    const existingOrder = orderDetails.find(item => item.productId === product._id);
    let updatedOrders;
    if (existingOrder) {
      updatedOrders = orderDetails.map(item =>
        item.productId === product._id
          ? {
              ...item,
              quantity: item.quantity + quantity,
              totalPrice: (item.quantity + quantity) * product.price,
            }
          : item
      );
    } else {
      updatedOrders = [...orderDetails, newOrder];
    }

    try {
      await axios.patch(`/api/products/${product._id}/decrease-stock`, { quantity });

      setOrderDetails(updatedOrders);
      localStorage.setItem('orderDetails', JSON.stringify(updatedOrders));

      // Show success toast notification
      toast.success(`${product.name} added to cart!`);

      // Update cart count in Navbar or globally
      window.dispatchEvent(new Event('cartUpdated'));

      setStockError('');
      setQuantities((prev) => ({ ...prev, [product._id]: 1 }));
      setModalProduct(null);
    } catch (error) {
      setStockError('Failed to update stock');
    }
  };

  const handleQuantityIncrease = (productId) => {
    setQuantities((prev) => {
      const currentQuantity = prev[productId] || 1;
      const productStock = products.find(p => p._id === productId)?.stock || 1;

      if (currentQuantity < productStock) {
        return { ...prev, [productId]: currentQuantity + 1 };
      }
      return prev;
    });
  };

  const handleQuantityDecrease = (productId) => {
    setQuantities((prev) => {
      const currentQuantity = prev[productId] || 1;
      if (currentQuantity > 1) {
        return { ...prev, [productId]: currentQuantity - 1 };
      }
      return prev;
    });
  };

  const handleInputChange = (e, productId) => {
    const inputValue = e.target.value;

    if (!inputValue || isNaN(inputValue)) {
      setQuantities((prev) => ({
        ...prev,
        [productId]: 1,
      }));
      return;
    }

    const productStock = products.find(p => p._id === productId)?.stock || 1;
    const value = Math.max(1, Math.min(Number(inputValue), productStock));

    setQuantities((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const styles = {
    fontFamily: "'Playfair Display', serif",
    color: 'white',
    fontWeight: 'bold',
    pageWrapper: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#2c1b0b',
    },
    cartWrapper: { position: 'relative', cursor: 'pointer' },
    cartIcon: { fontSize: '20px', color: 'white' },
    cartCount: {
      position: 'absolute',
      top: '-5px',
      right: '-10px',
      backgroundColor: 'red',
      color: 'white',
      borderRadius: '50%',
      padding: '2px 6px',
      fontSize: '12px',
    },
    productCard: {
      borderRadius: '15px',
      backgroundColor: '#fff',
      overflow: 'hidden',
      boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
    },
    productImage: {
      width: '100%',
      height: '200px',
      objectFit: 'contain',
      transition: 'transform 0.3s ease',
    },
    productDetails: {
      padding: '15px',
      backgroundColor: '#fff',
      color: '#333',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    productName: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#333',
    },
    productDescription: {
      fontSize: '1rem',
      color: '#777',
    },
    productPrice: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#795C34',
    },
    stock: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#2c1b0b',
    },
    stockPriceContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: '8px',
    },
    quantityInput: {
      width: '60px',
      padding: '5px',
      borderRadius: '5px',
      fontSize: '1rem',
      margin: '0 5px',
      textAlign: 'center',
      backgroundColor: '#f0f0f0',
      border: '1px solid #ddd',
    },
    quantityControls: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    quantityButton: {
      backgroundColor: '#2c1b0b',
      color: 'white',
      border: 'none',
      padding: '5px 10px',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    productButton: {
      padding: '10px',
      borderRadius: '5px',
      backgroundColor: '#2c1b0b',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      color: '#fff',
    },
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.pageWrapper}>
      <div style={{ padding: '5.5rem' }}>
        <input
          type="text"
          placeholder="Search for coffee"
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            width: '25%',
            borderRadius: '5px',
            marginBottom: '20px',
            fontSize: '1rem',
          }}
        />

        {stockError && <div style={{ color: 'red', marginBottom: '20px' }}>{stockError}</div>}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
          }}
        >
          {loading ? (
            <div style={{ color: 'white' }}>Loading products...</div>
          ) : error ? (
            <div style={{ color: 'white' }}>Error: {error}</div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                style={styles.productCard}
                onClick={() => handleAddToCartClick(product)}
              >
                <img
                  src={`http://localhost:5200/${product.image}`}
                  alt={product.name}
                  style={styles.productImage}
                />
                <div style={styles.productDetails}>
                  <h3 style={styles.productName}>{product.name}</h3>
                  <p style={styles.productDescription}>{product.description}</p>
                  <div style={styles.stockPriceContainer}>
                    <p style={styles.stock}>Stock: {product.stock}</p>
                    <div style={styles.productPrice}>₱{product.price}</div>
                  </div>

                  <div style={styles.quantityControls}>
                    <button
                      style={styles.quantityButton}
                      onClick={() => handleQuantityDecrease(product._id)}
                      disabled={(quantities[product._id] || 1) <= 1} // disable if quantity is 1
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantities[product._id] || 1}
                      onChange={(e) => handleInputChange(e, product._id)}
                      style={styles.quantityInput}
                      min="1"
                      max={product.stock}
                    />
                    <button
                      style={styles.quantityButton}
                      onClick={() => handleQuantityIncrease(product._id)}
                      disabled={(quantities[product._id] || 1) >= product.stock}
                    >
                      +
                    </button>
                  </div>

                  <button
                    style={styles.productButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmAddToCart(product);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Toast Notification */}
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
      </div>
    </div>
  );
};

export default Menu;
