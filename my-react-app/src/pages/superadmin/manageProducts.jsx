import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import customFetch from '../../../../utils/customFetch.js';
import { toast } from 'react-toastify';

const styles = {
  navbarWrapper: {
    backgroundColor: '#5a3b22',
    width: '100%',
    height: '70px',
    position: 'fixed',
    top: 0,
    zIndex: 1000,
    fontFamily: "'Playfair Display', serif",
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    height: '100%',
    flexWrap: 'wrap',
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
    flexWrap: 'wrap',
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
    color: '#ffd700',
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
    backgroundColor: '#2c1b0b',
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
    backgroundColor: '#3e2c23', // dark brown background
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #8B7D7B', // warm grey border
    backgroundColor: '#f3f1ef',   // light beige input bg
  },
  button: {
    padding: '10px',
    backgroundColor: '#6f4e37', // medium brown
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#5a3b22',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    backgroundColor: '#f5f5f5', // light greyish bg
    borderRadius: '8px',
    overflow: 'hidden',
  },
  th: {
    textAlign: 'left',
    padding: '10px',
    backgroundColor: '#3e2c23', // dark brown
    color: 'white',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #ccc',
    backgroundColor: '#fcfaf9', // off-white for rows
  },
  actionBtn: {
    marginRight: '5px',
    padding: '5px 10px',
    borderRadius: '3px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  editBtn: {
    backgroundColor: '#007BFF', // blue
    color: 'white',
  },
  deleteBtn: {
    backgroundColor: '#DC3545', // red
    color: 'white',
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

    const logoutUser = async () => {
    try {
      await customFetch.get('/auth/logout');
      toast.success('Logging out...');
      navigate('/login');
    } catch (err) {
      toast.error('Logout failed');
    }
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
        await axios.patch(`/api/products/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        const res = await axios.post('/api/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setProducts([...products, res.data]);
      }

      setForm({ name: '', description: '', price: '', image: null });
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  const handleEdit = (product) => {
    navigate(`/superadmin/updateProduct/${product.id}`, {
      state: { product: product } // Pass the product details if needed
    });
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (confirmed) {
      navigate(`/superadmin/deleteProduct/${id}`); // Redirect to delete product page
    }
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
              <div style={{ ...styles.dropdownMenu, ...(isDropdownOpen ? styles.dropdownShow : {}) }}>
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
          <tr key={prod.id || prod._id || `${prod.name}-${prod.price}`}>
                <td style={styles.td}>{prod.name}</td>
                <td style={styles.td}>{prod.description}</td>
                <td style={styles.td}>₱{prod.price}</td>
                <td style={styles.td}>
                <img src={`http://localhost:5200/uploads/${prod.image}`} alt={prod.name} width={50} />
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
