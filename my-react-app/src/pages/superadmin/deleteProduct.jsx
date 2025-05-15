import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const DeleteProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      console.error("No ID in URL.");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5200/api/products/${id}`, {
          withCredentials: true,
        });
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    try {
      if (!id) {
        toast.error('Invalid product ID');
        return;
      }

      await axios.delete(`http://localhost:5200/api/products/${id}`, {
        withCredentials: true,
      });

      toast.success('Product deleted successfully');
      navigate('/superadmin/manageProducts');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/superadmin/manageProducts');
  };

  if (loading) return <p>Loading product info...</p>;
  if (!product) return <p>Product not found or already deleted.</p>;

  return (
    <div style={{ padding: '40px', fontFamily: "'Playfair Display', serif" }}>
      <h2>Delete Product</h2>
      <p>Are you sure you want to delete <strong>{product.name}</strong>?</p>
      <button
        style={{
          marginRight: '10px',
          padding: '10px',
          backgroundColor: '#DC3545',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={handleDelete}
      >
        Yes, Delete
      </button>
      <button
        style={{
          padding: '10px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={handleCancel}
      >
        Cancel
      </button>
    </div>
  );
};

export default DeleteProduct;
