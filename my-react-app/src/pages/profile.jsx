import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaUserCircle } from 'react-icons/fa';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ id: '', name: '', email: '', location: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [backHover, setBackHover] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('http://localhost:5200/api/v1/users/current-user', {
          method: 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const currentUser = data.user || {};
        setUser({
          id: currentUser._id,
          name: currentUser.name || '',
          email: currentUser.email || '',
          location: currentUser.location || '',
        });
      } catch (err) {
        setError('Failed to fetch user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const validateEmail = (email) => {
    // Simple email regex for validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSaveChanges = async () => {
    // Validation: all required fields must be filled
    if (!user.name.trim() || !user.email.trim() || !user.location.trim()) {
      alert('Please fill out all fields (Name, Email, and Location).');
      return;
    }

    // Email format validation
    if (!validateEmail(user.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5200/api/v1/users/users/${user.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: user.name, email: user.email, location: user.location }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      const updatedData = await response.json();
      console.log('Update response:', updatedData);

      const updatedUser = updatedData.user || updatedData;

      setUser((prev) => ({
        ...prev,
        name: updatedUser.name || prev.name,
        email: updatedUser.email || prev.email,
        location: updatedUser.location || prev.location,
      }));

      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert(`Error updating profile: ${error.message}`);
    }
  };

  if (loading) return <p style={centeredMessage}>Loading user data...</p>;
  if (error) return <p style={{ ...centeredMessage, color: 'red' }}>{error}</p>;

  const backButtonStyle = {
    ...buttonStyle,
    backgroundColor: backHover ? '#45a049' : '#4CAF50',
  };

  return (
    <div style={pageWrapper}>
      <FaUserCircle size={80} color="#371D10" style={{ marginBottom: '20px' }} />
      <h1 style={{ color: '#371D10', marginBottom: '30px' }}>My Profile</h1>
      <div style={formContainer}>
        {/* Name */}
        <div style={formGroup}>
          <label style={labelStyle}><FaUser style={iconStyle} /> Name:</label>
          {isEditing ? (
            <Input type="text" name="name" value={user.name} onChange={handleChange} style={inputStyle} />
          ) : (
            <p style={viewStyle}>{user.name || 'No name provided'}</p>
          )}
        </div>

        {/* Email */}
        <div style={formGroup}>
          <label style={labelStyle}><FaEnvelope style={iconStyle} /> Email:</label>
          {isEditing ? (
            <Input type="text" name="email" value={user.email} onChange={handleChange} style={inputStyle} disabled={false} />
          ) : (
            <p style={viewStyle}>{user.email || 'No email provided'}</p>
          )}
        </div>

        {/* Location */}
        <div style={formGroup}>
          <label style={labelStyle}><FaMapMarkerAlt style={iconStyle} /> Location:</label>
          {isEditing ? (
            <Textarea name="location" value={user.location} onChange={handleChange} style={textareaStyle} />
          ) : (
            <p style={viewStyle}>{user.location || 'No location provided'}</p>
          )}
        </div>

        {/* Buttons */}
        {isEditing ? (
          <button onClick={handleSaveChanges} style={saveButtonStyle}>Save Changes</button>
        ) : (
          <button onClick={toggleEdit} style={editButtonStyle}>Edit Profile</button>
        )}

        <button
          onClick={handleGoBack}
          style={backButtonStyle}
          onMouseEnter={() => setBackHover(true)}
          onMouseLeave={() => setBackHover(false)}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

const Input = ({ type, name, value, onChange, style, disabled }) => {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{
        ...style,
        ...(focused ? inputFocusStyle : {}),
        cursor: disabled ? 'not-allowed' : 'text',
        backgroundColor: disabled ? '#ddd' : style.backgroundColor,
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};

const Textarea = ({ name, value, onChange, style }) => {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      style={{ ...style, ...(focused ? inputFocusStyle : {}) }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};

// --- Styles (same as your current)
const pageWrapper = { display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px' };
const formContainer = {
  backgroundColor: '#371D10', padding: '40px', borderRadius: '12px', display: 'grid',
  gridTemplateColumns: '1fr', gap: '20px', color: 'white', width: '90%', maxWidth: '450px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
};
const formGroup = { display: 'flex', flexDirection: 'column' };
const labelStyle = { marginBottom: '6px', fontWeight: '600', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' };
const iconStyle = { marginRight: '4px' };
const inputStyle = {
  padding: '12px 16px', border: '2px solid #333', borderRadius: '8px', fontSize: '16px',
  color: '#333', backgroundColor: '#FFF6E5', width: '100%', minWidth: '300px', minHeight: '48px',
  transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
};
const inputFocusStyle = {
  borderColor: '#2196F3', boxShadow: '0 0 8px rgba(33, 150, 243, 0.6)', outline: 'none'
};
const textareaStyle = { ...inputStyle, minHeight: '100px', resize: 'vertical' };
const viewStyle = { padding: '10px', fontSize: '14px', backgroundColor: '#FFF6E5', color: '#333', borderRadius: '6px' };
const buttonStyle = {
  padding: '12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px',
  cursor: 'pointer', fontSize: '16px', transition: 'background-color 0.3s ease', width: '100%', marginTop: '12px'
};
const editButtonStyle = { ...buttonStyle, backgroundColor: '#FF9800', marginTop: '0' };
const saveButtonStyle = { ...buttonStyle, backgroundColor: '#2196F3', marginTop: '0' };
const centeredMessage = { textAlign: 'center', marginTop: '50px', fontSize: '18px' };

export default Profile;
