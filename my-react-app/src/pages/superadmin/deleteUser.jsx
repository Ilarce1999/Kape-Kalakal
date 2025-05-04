import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const styles = {
  navbarWrapper: {
    backgroundColor: '#A0522D',
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
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    fontFamily: "'Playfair Display', serif",
  },
  logo: {
    height: '40px',
    width: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
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
    backgroundColor: '#FDF6EC',
    paddingTop: '30px',        // reduced since we'll use margin instead
    maxWidth: '600px',
    margin: '100px auto 40px', // ⬅️ increased top margin
    textAlign: 'center',
    borderRadius: '10px',
    padding: '30px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  detail: {
    marginBottom: '10px',
    fontSize: '1.1rem',
  },
  deleteButton: {
    padding: '10px 20px',
    backgroundColor: '#A0522D',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginRight: '10px',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#CD853F',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
};

const DeleteUser = () => {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Super Admin';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/v1/users/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        toast.error('Failed to load user data.');
        navigate('/superadmin/allUsers');
      }
    };
    fetchUser();
  }, [userId, navigate]);

  const handleHardDelete = async () => {
    if (window.confirm("Are you sure you want to permanently delete this user?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/v1/users/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('User deleted permanently.');
        navigate('/superadmin/allUsers');
      } catch (err) {
        toast.error(err?.response?.data?.msg || 'Failed to delete user.');
      }
    }
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

  if (!user) {
    return <div style={{ paddingTop: '120px', textAlign: 'center' }}>Loading user data...</div>;
  }

  return (
    <div>
      {/* Navbar */}
      <div style={styles.navbarWrapper}>
        <nav style={styles.navbar}>
          <div style={styles.brand}>
            <img
              src="/logo.png" // replace with your actual logo path
              alt="Logo"
              style={styles.logo}
            />
            <span>Kape Kalakal</span>
          </div>
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

      {/* Confirmation Section */}
      <div style={styles.container}>
        <h2>Confirm User Deletion</h2>
        <p style={styles.detail}><strong>Name:</strong> {user.name}</p>
        <p style={styles.detail}><strong>Email:</strong> {user.email}</p>
        <p style={styles.detail}><strong>Location:</strong> {user.location}</p>
        <p style={styles.detail}><strong>Role:</strong> {user.role}</p>

        <div>
          <button style={styles.deleteButton} onClick={handleHardDelete}>
            Delete User Permanently
          </button>
          <Link to="/superadmin/allUsers">
            <button style={styles.cancelButton}>Cancel</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DeleteUser;
