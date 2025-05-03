import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import customFetch from '../../../../utils/customFetch.js';
import { toast } from 'react-toastify';

const styles = {
  navbarWrapper: {
    backgroundColor: '#8B4513',
    width: '100%',
    height: '60px',
    position: 'fixed',
    top: 0,
    zIndex: 1000,
  },
  navbar: {
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
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
  mainContainer: {
    paddingTop: '80px',
    paddingLeft: '20px',
    paddingRight: '20px',
    minHeight: '100vh',
    backgroundColor: '#f5f0eb',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  formWrapper: {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: '#fff8f0',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'block',
    color: '#5c3a1d',
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    backgroundColor: '#A0522D',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    width: '100%',
  },
  backButton: {
    marginTop: '20px',
    backgroundColor: '#5c3a1d',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  }
};

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    location: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await customFetch.post('/users/users', formData);
      toast.success('User added successfully');
      navigate('/superadmin/allUsers');
    } catch (error) {
      toast.error('Failed to add user');
    }
  };

  return (
    <>
      {/* Navbar */}
      <div style={styles.navbarWrapper}>
        <nav style={styles.navbar}>
          <div style={styles.navLeft}>
            <img src="/images/kape.jpg" alt="Logo" style={styles.logo} />
            <span style={styles.logoText}>Kape Kalakal - Super Admin</span>
          </div>
        </nav>
      </div>

      {/* Form + Content */}
      <div style={styles.mainContainer}>
        <div style={styles.formWrapper}>
          <h2 style={{ color: '#8B4513', textAlign: 'center', marginBottom: '20px' }}>Add New User</h2>
          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              name="name"
              style={styles.input}
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              style={styles.input}
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              style={styles.input}
              value={formData.password}
              onChange={handleChange}
              required
            />

            <label style={styles.label}>Role</label>
            <select
              name="role"
              style={styles.input}
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>

            <label style={styles.label}>Location</label>
            <input
              type="text"
              name="location"
              style={styles.input}
              value={formData.location}
              onChange={handleChange}
            />

            <button type="submit" style={styles.button}>Add User</button>
          </form>

          <button style={styles.backButton} onClick={() => navigate('/superadmin/allUsers')}>
            ← Back
          </button>
        </div>
      </div>
    </>
  );
};

export default AddUser;
