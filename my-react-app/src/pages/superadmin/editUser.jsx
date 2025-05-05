import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    height: '100%',
    color: 'white',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    fontFamily: "'Playfair Display', serif",
  },
  dropdown: {
    position: 'relative',
    display: 'inline-block',
  },
  dropdownContent: {
    display: 'none',
    position: 'absolute',
    backgroundColor: '#f1f1f1',
    minWidth: '120px',
    boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
    zIndex: 1,
    right: 0,
  },
  dropdownItem: {
    color: 'black',
    padding: '10px',
    textDecoration: 'none',
    display: 'block',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
  },
  container: {
    paddingTop: '80px',
    backgroundColor: '#F5DEB3',
    color: 'white',
    minHeight: '100vh',
  },
  content: {
    padding: '40px',
    maxWidth: '500px',
    margin: 'auto',
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#5a3b22',
  },
  backButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#ccc',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '20px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '24px',
    color: '#000000',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#000000',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  select: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    backgroundColor: 'white',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#2E1503',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: '',
    role: '',
  });
  const username = localStorage.getItem('username') || 'Super Admin';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await customFetch.get(`/users/users/${userId}`);
        setUser(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          location: response.data.location,
          role: response.data.role,
        });
      } catch (error) {
        toast.error('Failed to fetch user data');
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await customFetch.patch(`/users/users/${userId}`, formData);
      toast.success('User updated successfully');
      navigate('/superadmin/allUsers');
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleBack = () => {
    navigate('/superadmin/allUsers');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const toggleDropdown = () => {
    const content = document.getElementById('dropdown-content');
    if (content) {
      content.style.display = content.style.display === 'block' ? 'none' : 'block';
    }
  };

  if (!user) return <p style={{ textAlign: 'center', marginTop: '100px' }}>Loading user data...</p>;

  return (
    <div>
      {/* Navbar */}
      <div style={styles.navbarWrapper}>
        <nav style={styles.navbar}>
          <div style={styles.brand}>Kape Kalakal</div>
          <div style={styles.dropdown}>
            <button onClick={toggleDropdown} style={{ background: 'none', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
              {username} ▼
            </button>
            <div id="dropdown-content" style={styles.dropdownContent}>
              <button onClick={handleLogout} style={styles.dropdownItem}>Logout</button>
            </div>
          </div>
        </nav>
      </div>

      {/* Form */}
      <div style={styles.container}>
        <div style={styles.content}>
          <h2 style={styles.title}>Edit User</h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Location</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
            <button type="submit" style={styles.button}>Update User</button>
          </form>
          <button onClick={handleBack} style={styles.backButton}>Back to All Users</button>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
