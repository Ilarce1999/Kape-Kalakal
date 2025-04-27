import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, NavLink } from 'react-router-dom';
import customFetch from '../../../utils/customFetch';
import { FaShoppingCart } from 'react-icons/fa';

const styles = {
  pageWrapper: {
    backgroundColor: '#F5DEB3',
    minHeight: '100vh',
    margin: 0,
    padding: 0,
  },
  navbarWrapper: {
    backgroundColor: '#8B4513',
    width: '100%',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 30px',
    flexWrap: 'wrap',
  },
  navLeft: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    fontFamily: "'Playfair Display', serif",
    display: 'flex',         // Added flex
    alignItems: 'center',    // Ensures the text aligns with the logo
  },
  logo: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '10px', // Add margin to separate logo and text
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    transition: 'background-color 0.3s ease',
    fontWeight: '500',
  },
  activeLink: {
    backgroundColor: '#A0522D',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    border: 'none',
    fontSize: '1rem',
  },
  cartWrapper: {
    position: 'absolute',
    top: '25px',
    right: '10px',
    cursor: 'pointer',
  },
  cartIcon: {
    color: 'white',
    fontSize: '1.5rem',
  },
  cartCount: {
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '50%',
    padding: '5px 10px',
    position: 'absolute',
    top: '5px',
    right: '0',
    fontSize: '0.8rem',
  },
  dashboardContent: {
    padding: '40px 20px',
  },
  searchWrapper: {
    marginBottom: '30px',
    textAlign: 'right',
  },
  searchInput: {
    padding: '8px',
    fontSize: '1rem',
    width: '100%',
    maxWidth: '400px',
    borderRadius: '25px',
    border: '1px solid #8B4513',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    outline: 'none',
  },
  imageRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  },
  imageCard: {
    flex: '1 1 calc(100% - 40px)',
    maxWidth: '400px',
    textAlign: 'center',
    backgroundColor: '#fff8dc',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  cardImage: {
    width: '100%',
    height: '250px',
    objectFit: 'cover',
    borderRadius: '10px',
  },
  coffeeName: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: '15px 0 5px',
    color: '#4B2E2E',
  },
  description: {
    fontSize: '1rem',
    color: '#333',
  },
  priceTag: {
    backgroundColor: '#8B4513',
    color: '#fff',
    fontWeight: 'bold',
    padding: '10px 20px',
    borderRadius: '20px',
    display: 'inline-block',
    fontSize: '1.2rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    width: '50%',
    textAlign: 'center',
  },
  orderButton: {
    backgroundColor: '#4B2E2E',
    color: '#fff',
    fontWeight: 'bold',
    padding: '10px 20px',
    borderRadius: '25px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    width: '50%',
    textAlign: 'center',
    marginRight: '10px',
  },
  orderButtonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginTop: '10px',
  },
  footer: {
    backgroundColor: '#8B4513',
    color: 'white',
    textAlign: 'center',
    padding: '20px 0',
    fontSize: '0.9rem',
    fontFamily: "'Playfair Display', serif",
    marginTop: '40px',
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '10px',
  },
  footerLink: {
    color: 'white',
    textDecoration: 'none',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001,
  },
  modal: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '30px',
    borderRadius: '12px',
    width: '300px',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  modalButton: {
    backgroundColor: '#8B4513',
    color: '#3D2217',
    padding: '15px 20px',
    borderRadius: '25px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    border: 'none',
    width: '100%',
    marginTop: '20px',
  },
};

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoffee, setSelectedCoffee] = useState(null);
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [orderDetails, setOrderDetails] = useState(() => {
    // ⬇️ Load orderDetails from localStorage on initial render
    const savedOrders = localStorage.getItem('orderDetails');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // ⬇️ When orderDetails changes, save it to localStorage
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
  }, [orderDetails]);

  useEffect(() => {
    if (location.state && location.state.newOrder) {
      setOrderDetails((prevDetails) => [...prevDetails, ...location.state.newOrder]);
    }
  }, [location.state]);

  const logoutUser = async () => {
    try {
      await customFetch.get('/auth/logout');
      localStorage.removeItem('orderDetails'); // clear saved orders on logout
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const coffees = [
    { name: 'Espresso', description: 'A bold and rich shot of pure coffee.', price: 120, image: '/images/image1.jpg' },
    { name: 'Cappuccino', description: 'Espresso, steamed milk, and foam.', price: 140, image: '/images/image2.jpg' },
    { name: 'Iced Latte', description: 'Cold coffee with milk.', price: 150, image: '/images/image3.jpg' },
    { name: 'Flat White', description: 'Microfoamed milk on espresso.', price: 130, image: '/images/image4.jpg' },
    { name: 'Cortado', description: 'Espresso with milk.', price: 150, image: '/images/image5.jpg' },
    { name: 'Americano', description: 'Espresso over ice and cold water.', price: 135, image: '/images/image6.jpg' },
  ];

  const filteredCoffees = coffees.filter((coffee) =>
    coffee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOrderClick = (coffee) => {
    setSelectedCoffee(coffee);
    setIsModalOpen(true);
  };

  const handleAddToOrder = () => {
    if (size && quantity > 0) {
      const sizePrice = size === 'Medium' ? 10 : size === 'Large' ? 25 : 0;
      const totalPriceForItem = (selectedCoffee.price + sizePrice) * quantity;

      const newOrder = {
        ...selectedCoffee,
        size,
        quantity,
        totalPrice: totalPriceForItem,
      };

      setOrderDetails((prevOrders) => [...prevOrders, newOrder]);
      setIsModalOpen(false);
      setSize('');
      setQuantity(1);

      customFetch.post('/drinks', {
        orderedBy: 'userId',
        drinkName: selectedCoffee.name,
        size: size,
        quantity,
        totalPrice: totalPriceForItem,
      }).catch(console.error);
    }
  };

  const totalItems = orderDetails.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = orderDetails.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleCartClick = () => {
    navigate('/checkout', { state: { orderDetails, totalPrice } });
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.navbarWrapper}>
        <nav style={styles.navbar}>
          <div style={styles.navLeft}>
            <img src="/images/kape.jpg" alt="Logo" style={styles.logo} />
            <span>Kape Kalakal</span>
          </div>
          <div style={styles.navRight}>
            <Link to="/dashboard" style={styles.navLink}>HOME</Link>
            <Link to="/aboutus" style={styles.navLink}>ABOUT US</Link>
            <NavLink 
              to="/menu" 
              style={({ isActive }) => isActive ? { ...styles.navLink, ...styles.activeLink } : styles.navLink}
            >
              PRODUCTS
            </NavLink>
            <Link to="/settings" style={styles.navLink}>SETTINGS</Link>
            <button onClick={logoutUser} style={styles.logoutButton}>LOGOUT</button>
            <div style={styles.cartWrapper} onClick={handleCartClick}>
              <FaShoppingCart style={styles.cartIcon} />
              {totalItems > 0 && <span style={styles.cartCount}>{totalItems}</span>}
            </div>
          </div>
        </nav>
      </div>

      <div style={styles.dashboardContent}>
        <div style={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search for your favorite coffee..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={styles.imageRow}>
          {filteredCoffees.map((coffee, index) => (
            <div key={index} style={styles.imageCard}>
              <img src={coffee.image} alt={coffee.name} style={styles.cardImage} />
              <div style={styles.coffeeName}>{coffee.name}</div>
              <p style={styles.description}>{coffee.description}</p>
              <div style={styles.orderButtonContainer}>
                <button style={styles.orderButton} onClick={() => handleOrderClick(coffee)}>
                  Add to Order
                </button>
                <div style={styles.priceTag}>₱{coffee.price}</div>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
  <div style={styles.modalOverlay}>
    <div style={styles.modal}>
      <h2>{selectedCoffee.name}</h2>
      <p>{selectedCoffee.description}</p>
      <p>Price: ₱{selectedCoffee.price}</p>

      <div>
        <label>Size:</label>
        <select value={size} onChange={(e) => setSize(e.target.value)}>
          <option value="">Select size</option>
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Large">Large</option>
        </select>
      </div>

      <div>
        <label>Quantity:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>

      <button onClick={handleAddToOrder} style={styles.modalButton}>
        Add to Cart
      </button>

      {/* ⬇️ Added Exit Button */}
      <button
        onClick={() => {
          setIsModalOpen(false);
          setSize('');
          setQuantity(1);
        }}
        style={{ ...styles.modalButton, backgroundColor: '#D2B48C', color: 'brown' }}
      >
        Exit
      </button>
    </div>
  </div>
)}

      </div>

      <div style={styles.footer}>
        <p>© 2025 Kape Kalakal | All Rights Reserved</p>
        <div style={styles.footerLinks}>
          <a href="/terms" style={styles.footerLink}>Terms of Service</a>
          <a href="/privacy" style={styles.footerLink}>Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default Menu;
