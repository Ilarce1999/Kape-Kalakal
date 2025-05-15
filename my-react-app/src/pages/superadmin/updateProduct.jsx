import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const styles = {
  container: {
    maxWidth: '600px',
    margin: 'auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    marginTop: '50px',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '28px',
    color: '#333',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#333',
    marginBottom: '8px',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginTop: '6px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginTop: '6px',
    boxSizing: 'border-box',
    resize: 'vertical',
  },
  fileInput: {
    marginTop: '6px',
  },
  button: {
    backgroundColor: '#2E1503',
    color: '#fff',
    padding: '12px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%',
    marginTop: '20px',
  },
  backButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#ccc',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    textAlign: 'center',
    width: '100%',
  },
  imagePreview: {
    marginTop: '10px',
    textAlign: 'center',
  },
  previewImage: {
    maxWidth: '100%',
    maxHeight: '200px',
    objectFit: 'contain',
    borderRadius: '8px',
  },
};

const UpdateProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state;

  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,  // Added stock to form data
  });
  const [previewImage, setPreviewImage] = useState(product.image);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setFormData((prevState) => ({
        ...prevState,
        image: null,
      }));
      setPreviewImage(null);
      return;
    }

    setFormData((prevState) => ({
      ...prevState,
      image: file,
    }));

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price || !formData.stock) {
      toast.error("All fields must be filled!");
      return;
    }

    const dataToSubmit = new FormData();
    dataToSubmit.append('name', formData.name);
    dataToSubmit.append('description', formData.description);
    dataToSubmit.append('price', formData.price);
    dataToSubmit.append('stock', formData.stock);  // Send stock along with other data
    if (formData.image) dataToSubmit.append('image', formData.image);

    try {
      await axios.put(`/api/products/${product._id}`, dataToSubmit, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/superadmin/products');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  useEffect(() => {
    document.body.style.backgroundColor = '#5a3b22';
    document.body.style.color = '#fff';
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    };
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Update Product</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            style={styles.textarea}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Stock:</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          {previewImage && (
            <div style={styles.imagePreview}>
              <img
                src={previewImage}
                alt="Product Preview"
                style={styles.previewImage}
              />
            </div>
          )}
        </div>
        <button type="submit" style={styles.button}>Update Product</button>
      </form>
      <button
        onClick={() => navigate('/superadmin/manageProducts')}
        style={styles.backButton}
      >
        Back to Product List
      </button>
    </div>
  );
};

export default UpdateProduct;
