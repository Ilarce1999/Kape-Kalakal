import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DeleteProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (confirmed) {
      try {
        await axios.delete(`/api/products/${id}`);
        // After deletion, redirect to the manage products page
        navigate('/superadmin/manageProducts');
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleCancel = () => {
    navigate('/superadmin/manageProducts');
  };

  if (!product) return <p>Loading product info...</p>;

  return (
    <div style={{ padding: '40px' }}>
      <h2>Delete Product</h2>
      <p>Are you sure you want to delete <strong>{product.name}</strong>?</p>
      <button
        style={{ marginRight: '10px', padding: '10px', backgroundColor: '#DC3545', color: 'white', border: 'none', borderRadius: '5px' }}
        onClick={() => handleDelete(id)} // Pass the id to the handleDelete function
      >
        Yes, Delete
      </button>
      <button
        style={{ padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px' }}
        onClick={handleCancel}
      >
        Cancel
      </button>
    </div>
  );
};

export default DeleteProduct;
