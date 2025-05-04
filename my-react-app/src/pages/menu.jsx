import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useLoaderData, NavLink, redirect } from 'react-router-dom';
import customFetch from '../../../utils/customFetch';
import { FaShoppingCart } from 'react-icons/fa';

// ADD THIS LOADER export here
export const loader = async () => {
  try {
    const { data } = await customFetch.get('/users/current-user');
    return data;
  } catch (error) {
    return redirect('/');
  }
};

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
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  navRight: {
    display: 'flex',
    gap: '10px', // Reduced gap to bring elements closer together
    alignItems: 'center',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '6px 12px', // Adjusted padding to make the links closer
    borderRadius: '8px',
    fontWeight: '500',
    transition: 'background-color 0.3s ease',
  },
  activeLink: {
    backgroundColor: '#A0522D',
    fontWeight: 'bold',
    borderRadius: '5px',
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
    top: '28px',
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
  dropdown: {
    position: 'relative',
    cursor: 'pointer',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    right: '0',
    backgroundColor: '#fff',
    color: '#371D10',
    padding: '10px 20px',
    borderRadius: '5px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'none',
  },
  dropdownShow: {
    display: 'block',
  },
  dropdownItem: {
    padding: '5px 10px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  dropdownButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '10px',
    position: 'relative',
    marginLeft: 'auto', // keeps it pushed to the right
    marginRight: '20px', // <--- this moves it left from the edge
  },
  
  icon: {
    fontSize: '18px',
    display: 'inline-block',
    transform: 'translateY(1px)', 
  },
};

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoffee, setSelectedCoffee] = useState(null);
  const [size, setSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [orderDetails, setOrderDetails] = useState(() => {
    const savedOrders = localStorage.getItem('orderDetails');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  const navigate = useNavigate();
  const location = useLocation();
  
    const { user } = useLoaderData();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
  }, [orderDetails]);

  useEffect(() => {
    if (location.state) {
      if (location.state.newOrder) {
        setOrderDetails((prevDetails) => [...prevDetails, ...location.state.newOrder]);
      }
      if (location.state.updatedOrderDetails) {
        setOrderDetails(location.state.updatedOrderDetails);
      }
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  {/* useEffect(() => {
    const fetchCartOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5200/api/v1/drinks", {
          withCredentials: true,
        });
        setCartOrders(response.data);
      } catch (err) {
        console.error("Failed to fetch cart orders", err);
      }
    };
  
    fetchCartOrders();
  }, []); */}

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  

  const logoutUser = async () => {
    try {
      await customFetch.get('/auth/logout');
      localStorage.removeItem('orderDetails');
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
  
      customFetch.post('/drinks', {
        orderedBy: user?._id,  // Ensure `user` is correctly fetched and available in state/context
        drinkName: selectedCoffee.name,
        size,
        quantity,
        totalPrice: totalPriceForItem,
      })
        .then(() => {
          setIsModalOpen(false);
          setSize('');  // Reset size
          setQuantity(1);  // Reset quantity
        })
        .catch((err) => {
          alert('Error adding to order. Please try again.');
          console.error(err);  // Log the error for debugging
        });
    } else {
      alert('Please select size and quantity.');
    }
  };

  const totalItems = orderDetails.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = orderDetails.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleCartClick = () => {
    if (orderDetails.length === 0) {
      localStorage.removeItem('orderDetails');
    }
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
            <div style={styles.dropdown} onClick={toggleDropdown}>
              <button style={styles.dropdownButton}>
                <span>{user?.name}</span>
                <span style={styles.icon}>▼</span>
              </button>
              <div
                style={{
                  ...styles.dropdownMenu,
                  ...(isDropdownOpen ? styles.dropdownShow : {}),
                }}
              >
                <div style={styles.dropdownItem} onClick={logoutUser}>
                  Logout
                </div>
              </div>
            </div>
            <div style={styles.cartWrapper} onClick={handleCartClick}>
              <FaShoppingCart style={styles.cartIcon} />
              {totalItems > 0 && <span style={styles.cartCount}>{totalItems}</span>}
            </div>
          </div>
        </nav>
      </div>

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
