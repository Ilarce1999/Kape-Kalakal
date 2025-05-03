import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const styles = {
  button: {
    padding: '10px 20px',
    backgroundColor: '#A0522D',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  confirmButton: {
    padding: '10px 20px',
    backgroundColor: '#8B4513',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '10px',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#808080',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '10px',
  },
  loader: {
    marginTop: '20px',
  },
};

const DeleteUser = () => {
  const [isConfirming, setIsConfirming] = useState(false); // To handle the confirmation state
  const [isLoading, setIsLoading] = useState(false); // To handle loading state
  const [error, setError] = useState(null); // To handle errors
  const navigate = useNavigate();
  const { userId } = useParams();

  const handleDelete = async (userId) => {
    try {
      const response = await axios.delete(`/users/${userId}`);
      if (response.status === 200) {
        toast.success('User deleted successfully!');
        // Filter out the deleted user from the state
        const updatedUsers = users.filter((user) => user._id !== userId);
        setUsers(updatedUsers);
      } else {
        toast.error('Error deleting user. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user. Please try again.');
    }
  };

  const handleCancel = () => {
    setIsConfirming(false); // Close the confirmation dialog
  };

  return (
    <div>
      <h1>Delete User</h1>
      <button style={styles.button} onClick={() => setIsConfirming(true)} disabled={isLoading}>
        Delete User
      </button>

      {isConfirming && (
        <div>
          <p>Are you sure you want to delete this user? This action cannot be undone.</p>
          <button style={styles.confirmButton} onClick={handleDelete} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Yes, Delete'}
          </button>
          <button style={styles.cancelButton} onClick={handleCancel} disabled={isLoading}>
            Cancel
          </button>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isLoading && <div style={styles.loader}>Loading...</div>}
    </div>
  );
};

export default DeleteUser;
