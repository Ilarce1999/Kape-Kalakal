import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  },
  logoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    fontFamily: "'Playfair Display', serif",
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#8B4513',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#A0522D',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  formContainer: {
    paddingTop: '100px',
    maxWidth: '400px',
    margin: 'auto',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
};

const EditUser = ({ users, setUsers }) => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    location: '',
    role: '',
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userId } = useParams();

  // Fetch user data when the page loads
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/users/${userId}`);
        if (res.data) {
          setUser(res.data); // Set fetched user data into the state
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = { ...user };
      if (!updatedUser.password) {
        delete updatedUser.password; // Ensure password is not sent unless updated
      }
  
      const response = await axios.patch(`/users/${userId}`, updatedUser);
      if (response.status === 200) {
        toast.success('User updated successfully!');
        // Update the user list in the state
        const updatedUsers = users.map((u) =>
          u._id === userId ? { ...u, ...user } : u
        );
        setUsers(updatedUsers);
  
        // Redirect or update UI after successful update
        navigate('/superadmin/allUsers');
      } else {
        toast.error('Error updating user. Please try again.');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error updating user. Please try again.');
    }
  };
  

  if (loading) {
    return <div>Loading...</div>; // Show loading state until data is fetched
  }

  return (
    <div>
      {/* Navbar */}
      <div style={styles.navbarWrapper}>
        <nav style={styles.navbar}>
          <span style={styles.logoText}>Kape Kalakal - Super Admin</span>
        </nav>
      </div>

      {/* Form */}
      <div style={styles.formContainer}>
        <h2>Edit User</h2>

        <Link to="/superadmin/allUsers">
          <button style={styles.backButton}>Back to All Users</button>
        </Link>

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            placeholder="Full Name (e.g. John Doe)"
            required
          />
          <input
            style={styles.input}
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Email (e.g. john.doe@example.com)"
            required
          />
          <input
            style={styles.input}
            type="text"
            name="location"
            value={user.location}
            onChange={handleChange}
            placeholder="Location (e.g. Manila)"
            required
          />
          <input
            style={styles.input}
            type="text"
            name="role"
            value={user.role}
            onChange={handleChange}
            placeholder="Role (e.g. Admin)"
            required
          />
          <button style={styles.button} type="submit">
            Update User
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
