import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const styles = {
  navbarWrapper: {
    backgroundColor: '#8B4513',
    width: '100%',
    height: '70px',
    position: 'fixed',
    top: 0,
    zIndex: 1000,
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    height: '100%',
    flexWrap: 'wrap', // To allow the navbar to wrap on smaller screens
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logo: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  logoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    fontFamily: "'Playfair Display', serif",
  },
  navItems: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    flexWrap: 'wrap', // Allow wrapping for responsiveness
  },
  navItem: {
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    textDecoration: 'none',
    cursor: 'pointer',
    padding: '5px 10px',
    transition: 'color 0.3s ease, background-color 0.3s ease',
  },
  activeLink: {
    backgroundColor: '#A0522D',
    borderRadius: '5px',
  },
  dropdown: {
    position: 'relative',
    cursor: 'pointer',
  },
  dropdownButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    cursor: 'pointer',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
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
  icon: {
    fontSize: '18px',
  },
  content: {
    paddingTop: '100px',
    padding: '40px 20px',
    backgroundColor: '#F5DEB3',
    minHeight: '100vh',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '400px',
    marginBottom: '30px',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    backgroundColor: '#8B4513',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  th: {
    textAlign: 'left',
    padding: '10px',
    backgroundColor: '#8B4513',
    color: 'white',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #ccc',
  },
  img: {
    width: '50px',
  },
  actionBtn: {
    marginRight: '5px',
    padding: '5px 10px',
    borderRadius: '3px',
    border: 'none',
    cursor: 'pointer',
  },
  editBtn: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  deleteBtn: {
    backgroundColor: '#f44336',
    color: 'white',
  },
  '@media (max-width: 768px)': {
    navbar: {
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '10px',
    },
    navItems: {
      flexDirection: 'column',
      gap: '10px',
      width: '100%',
      textAlign: 'center',
    },
    content: {
      paddingTop: '120px', // Make space for navbar on small screens
      padding: '20px',
    },
    form: {
      width: '100%',
      maxWidth: 'none',
    },
    button: {
      width: '100%',
    },
    table: {
      fontSize: '14px',
    },
  },
};

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', image: null });
  const [editingId, setEditingId] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: 'Super Admin' });

  const navigate = useNavigate();
  const location = useLocation();

  const fetchProducts = async () => {
    const res = await axios.get('/api/products');
    setProducts(res.data);
  };

  const logoutUser = () => {
    axios.post('/api/logout').then(() => {
      navigate('/');
    });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', form.price);
    if (form.image) formData.append('image', form.image);

    try {
      if (editingId) {
        // Update existing product
        await axios.patch(`/api/products/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // Add new product
        const res = await axios.post('/api/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        // Add the new product to the table (client-side)
        setProducts([...products, res.data]);  // Append the newly created product to the products list
      }

      // Clear the form and reset the editing state
      setForm({ name: '', description: '', price: '', image: null });
      setEditingId(null);

      // Optionally, you can fetch the updated product list again from the server
      fetchProducts();
      navigate('/superadmin/manageProducts'); // Redirect to the same page after submission
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: null,
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/products/${id}`);
    fetchProducts();
  };

  const getLinkStyle = (path) => ({
    ...styles.navItem,
    ...(location.pathname === path ? styles.activeLink : {}),
  });

  return (
    <div>
      {/* Navbar */}
      <div style={styles.navbarWrapper}>
        <nav style={styles.navbar}>
          <div style={styles.navLeft}>
            <img src="/images/kape.jpg" alt="Logo" style={styles.logo} />
            <span style={styles.logoText}>Kape Kalakal - Super Admin</span>
          </div>

          <div style={styles.navItems}>
            <Link to="/superadmin" style={getLinkStyle('/superadmin')}>HOME</Link>
            <Link to="/superadmin/manageProducts" style={getLinkStyle('/superadmin/manageProducts')}>MANAGE PRODUCTS</Link>
            <Link to="/superadmin/allUsers" style={getLinkStyle('/superadmin/allUsers')}>MANAGE USERS</Link>

            <div style={styles.dropdown} onClick={toggleDropdown}>
              <button style={styles.dropdownButton}>
                <span>{currentUser?.name}</span>
                <span style={styles.icon}>▼</span>
              </button>
              <div
                style={{
                  ...styles.dropdownMenu,
                  ...(isDropdownOpen ? styles.dropdownShow : {}),
                }}
              >
                <div style={{ cursor: 'pointer' }} onClick={logoutUser}>Logout</div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <h2 style={styles.heading}>Manage Products</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Product Name"
            required
          />
          <input
            style={styles.input}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Product Description"
            required
          />
          <input
            style={styles.input}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="Product Price"
            type="number"
            required
          />
          <input
            style={styles.input}
            type="file"
            onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          />
          <button type="submit" style={styles.button}>
            {editingId ? 'Update' : 'Add'} Product
          </button>
        </form>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Image</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id}>
                <td style={styles.td}>{prod.name}</td>
                <td style={styles.td}>{prod.description}</td>
                <td style={styles.td}>₱{prod.price}</td>
                <td style={styles.td}>
                  <img src={prod.image} alt={prod.name} style={styles.img} />
                </td>
                <td style={styles.td}>
                  <button
                    onClick={() => handleEdit(prod)}
                    style={{ ...styles.actionBtn, ...styles.editBtn }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(prod.id)}
                    style={{ ...styles.actionBtn, ...styles.deleteBtn }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageProducts;
