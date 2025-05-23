import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import customFetch from '../../../../utils/customFetch.js';
import { toast } from 'react-toastify';

const styles = {

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
    maxWidth: '600px',
    marginBottom: '30px',
    backgroundColor: '#3e2c23',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #8B7D7B',
    backgroundColor: '#f3f1ef',
  },
  button: {
    padding: '10px',
    backgroundColor: '#6f4e37',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  th: {
    textAlign: 'left',
    padding: '10px',
    backgroundColor: '#3e2c23',
    color: 'white',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #ccc',
    backgroundColor: '#fcfaf9',
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
    backgroundColor: '#007BFF',
    color: 'white',
  },
  deleteBtn: {
    backgroundColor: '#DC3545',
    color: 'white',
  },
};

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: 'Super Admin' });

  const navigate = useNavigate();
  const location = useLocation();

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (error) {
      toast.error('Failed to fetch products');
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
  
    if (!form.name || !form.description || !form.price || !form.stock) {
      toast.error('Please fill in all fields');
      return;
    }
  
    const price = Number(form.price);
    const stock = Number(form.stock);
  
    if (price <= 0 || stock < 0) {
      toast.error('Please enter valid price and stock values');
      return;
    }
  
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', price);
    formData.append('stock', stock);
  
    if (form.image) {
      formData.append('image', form.image);
    } else if (!editingId) {
      toast.error('Please select an image');
      return;
    }
  
    try {
      if (editingId) {
        await axios.patch(`/api/products/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product updated successfully');
      } else {
        const res = await axios.post('/api/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Product added successfully');
        setProducts((prev) => [...prev, res.data]);
      }
  
      setForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        image: null,
      });
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error('Error submitting product:', error?.response?.data || error.message);
      toast.error(error?.response?.data?.msg || 'Failed to submit product');
    }
  };
  const handleEdit = (product) => {
    // Navigate to update page with product data
    navigate(`/superadmin/updateProduct/${product._id}`, { state: { product } });
  };
  

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;
  
    try {
      await axios.delete(`/api/products/${id}`);
      toast.success('Product deleted successfully');
      // Remove deleted product from state
      setProducts((prev) => prev.filter((prod) => prod._id !== id));
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const getLinkStyle = (path) => ({
    ...styles.navItem,
    ...(location.pathname === path ? styles.activeLink : {}),
  });

  return (
    <div>
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
            placeholder="Description"
            required
          />
          <input
            style={styles.input}
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="Price"
            required
          />
          <input
            style={styles.input}
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            placeholder="Stock"
            required
          />
          <input
            style={styles.input}
            type="file"
            accept="image/*"
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
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Image</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod._id || prod.id}>
                <td style={styles.td}>{prod.name}</td>
                <td style={styles.td}>{prod.description}</td>
                <td style={styles.td}>₱{prod.price}</td>
                <td style={styles.td}>{prod.stock}</td>
                <td style={styles.td}>
                  {prod.image ? (
                    <img src={`http://localhost:5200/${prod.image}`} alt={prod.name} width={50} />
                  ) : (
                    'No Image'
                  )}
                </td>
                <td style={styles.td}>
                  <button onClick={() => handleEdit(prod)} style={{ ...styles.actionBtn, ...styles.editBtn }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(prod._id)} style={{ ...styles.actionBtn, ...styles.deleteBtn }}>
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
