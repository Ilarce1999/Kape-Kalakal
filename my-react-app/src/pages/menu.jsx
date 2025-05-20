import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useLoaderData, redirect } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import customFetch from '../../../utils/customFetch.js';
import axios from 'axios';

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

  // State to track quantities per product
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
    setStockError(''); // Reset stock error message
  };
  
  const confirmAddToCart = async () => {
    if (!modalProduct) return; // Safety check
  
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
  
    // Check if product already in cart
    const existingOrder = orderDetails.find(
      (item) => item.productId === product._id
    );
  
    let updatedOrders;
    if (existingOrder) {
      updatedOrders = orderDetails.map((item) =>
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
      // Call backend to decrease stock
      await axios.patch(`/api/products/${product._id}/decrease-stock`, { quantity });
  
      setOrderDetails(updatedOrders);
      localStorage.setItem('orderDetails', JSON.stringify(updatedOrders));
      setStockError('');
      setQuantities((prev) => ({ ...prev, [product._id]: 1 }));
      setModalProduct(null); // Close modal after adding
    } catch (error) {
      setStockError('Failed to update stock');
    }
  };
  

  const logoutHandler = () => {
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    navigate('/login');
    if (logoutUser) logoutUser();
  };

  const handleQuantityIncrease = (productId) => {
    setQuantities((prev) => {
      const currentQuantity = prev[productId] || 1;
      // Get product stock by productId dynamically
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
    navbarWrapper: { backgroundColor: '#5a3b22', borderBottom: '1px solid #ddd' },
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '80px',
      padding: '0 20px',
    },
    navLeft: { display: 'flex', alignItems: 'center' },
    logo: {
      height: '40px',
      width: '40px',
      marginRight: '10px',
      borderRadius: '50%',
    },
    navRight: { display: 'flex', alignItems: 'center', gap: '30px' },
    navLink: {
      textDecoration: 'none',
      color: 'white',
      fontWeight: 'bold',
      fontFamily: "'Playfair Display', serif",
    },
    activeLink: { color: '#ffd700' },
    dropdown: { position: 'relative', cursor: 'pointer' },
    dropdownButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: 'white',
      fontSize: '1rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
    },
    dropdownMenu: {
      position: 'absolute',
      top: '100%',
      right: '0',
      backgroundColor: '#5a3b22',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '5px',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      display: 'none',
      minWidth: '100px',
      zIndex: 10,
    },
    dropdownShow: { display: 'block' },
    dropdownItem: {
      padding: '5px 10px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
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
    footer: {
      backgroundColor: '#5a3b22',
      padding: '20px 0',
      borderTop: '1px solid #ddd',
      textAlign: 'center',
      marginTop: 'auto',
      color: '#fff',
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
      <div style={styles.navbarWrapper}>
        <nav style={styles.navbar}>
          <div style={styles.navLeft}>
            <img src="/images/kape.jpg" alt="Logo" style={styles.logo} />
            <span style={styles.navLink}>Kape Kalakal</span>
          </div>
          <div style={styles.navRight}>
            <Link to="/dashboard" style={styles.navLink}>HOME</Link>
            <Link to="/aboutus" style={styles.navLink}>ABOUT US</Link>
            <Link to="/viewMyOrder" style={styles.navLink}>MY ORDERS</Link>
            <NavLink
              to="/menu"
              style={({ isActive }) =>
                isActive ? { ...styles.navLink, ...styles.activeLink } : styles.navLink
              }
            >
              PRODUCTS
            </NavLink>
            <Link to="/settings" style={styles.navLink}>SETTINGS</Link>
            <div style={styles.cartWrapper} onClick={handleCartClick}>
              <FaShoppingCart style={styles.cartIcon} />
              {totalProducts > 0 && (
                <div style={styles.cartCount}>{totalProducts}</div>
              )}
            </div>
            <div style={styles.dropdown} onClick={toggleDropdown}>
              <button style={styles.dropdownButton}>
                <span>{user?.name}</span>
                <span>▼</span>
              </button>
              <div
                style={{
                  ...styles.dropdownMenu,
                  ...(isDropdownOpen ? styles.dropdownShow : {}),
                }}
              >
                <div
                  style={styles.dropdownItem}
                  onClick={() => navigate('/profile')}
                >
                  Profile
                </div>
                <div
                  style={styles.dropdownItem}
                  onClick={() => logoutHandler()}
                >
                  Logout
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div style={{ padding: '20px' }}>
        <h1 style={{ color: 'white' }}>Menu</h1>
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
                      disabled={(quantities[product._id] || 1) >= product.stock} // disable if quantity at max stock
                    >
                      +
                    </button>
                  </div>

                  <button
                    style={styles.productButton}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the card onClick if any
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
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', padding: '0 20px' }}>
          <div style={{ flex: '1 1 250px', margin: '10px' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Customer Service</h4>
            <p>Need help? Our team is here for you 24/7.</p>
            <p>FAQs</p>
            <p>Returns & Refunds</p>
            <p>Order Tracking</p>
          </div>
          <div style={{ flex: '1 1 250px', margin: '10px' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Contact Us</h4>
            <p>Email: support@kapekalakal.com</p>
            <p>Phone: +63 912 345 6789</p>
            <p>Address: 123 Brew Street, Makati, PH</p>
          </div>
          <div style={{ flex: '1 1 250px', margin: '10px' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>About Us</h4>
            <p>Kape Kalakal is your go-to café for premium Filipino coffee blends. We're passionate about coffee and community.</p>
            <p>Read Our Story</p>
          </div>
        </div>
        <div style={{ marginTop: '20px' }}>
          <p>© 2025 Kape Kalakal. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Menu;
