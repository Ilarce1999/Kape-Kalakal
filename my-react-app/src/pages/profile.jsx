import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaUserCircle, FaLock } from 'react-icons/fa';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ id: '', name: '', email: '', location: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setIsChangingPassword(false);
  };

  const togglePasswordMode = () => {
    setIsChangingPassword(!isChangingPassword);
    setIsEditing(false);
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSaveChanges = async () => {
    if (!user.name.trim() || !user.email.trim() || !user.location.trim()) {
      alert('Please fill out all fields (Name, Email, and Location).');
      return;
    }

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

  const handlePasswordUpdate = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwords;

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('All password fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('New password and confirmation do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5200/api/v1/users/update-password', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword: currentPassword, newPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.msg || result.message || 'Failed to update password');
      }

      alert('Password updated successfully!');
      togglePasswordMode();
    } catch (err) {
      console.error(err);
      alert(`Error updating password: ${err.message}`);
    }
  };

  if (loading) return <p style={centeredMessage}>Loading user data...</p>;
  if (error) return <p style={{ ...centeredMessage, color: 'red' }}>{error}</p>;

  const backButtonStyle = {
    ...buttonStyle,
    backgroundColor: backHover ? '#4E342E' : '#5C4033', // Deep brown and hover
  };

  return (
    <div style={pageWrapper}>
      <FaUserCircle size={80} color="#371D10" style={{ marginBottom: '20px' }} />
      <h1 style={{ color: '#371D10', marginBottom: '30px' }}>My Profile</h1>
      <div style={formContainer}>
        {!isChangingPassword ? (
          <>
            <FormGroup label="Name" icon={<FaUser />} isEditing={isEditing} value={user.name} name="name" onChange={handleChange} />
            <FormGroup label="Email" icon={<FaEnvelope />} isEditing={isEditing} value={user.email} name="email" onChange={handleChange} />
            <FormGroup label="Location" icon={<FaMapMarkerAlt />} isEditing={isEditing} value={user.location} name="location" onChange={handleChange} isTextarea />
            {isEditing ? (
              <button onClick={handleSaveChanges} style={saveButtonStyle}>Save Changes</button>
            ) : (
              <button onClick={toggleEdit} style={editButtonStyle}>Edit Profile</button>
            )}
          </>
        ) : (
          <>
            <FormGroup label="Current Password" icon={<FaLock />} value={passwords.currentPassword} name="currentPassword" onChange={handlePasswordChange} isPassword />
            <FormGroup label="New Password" icon={<FaLock />} value={passwords.newPassword} name="newPassword" onChange={handlePasswordChange} isPassword />
            <FormGroup label="Confirm Password" icon={<FaLock />} value={passwords.confirmPassword} name="confirmPassword" onChange={handlePasswordChange} isPassword />
            <button onClick={handlePasswordUpdate} style={saveButtonStyle}>Update Password</button>
          </>
        )}

        <button onClick={togglePasswordMode} style={{ ...buttonStyle, backgroundColor: '#8B4513' }}>
          {isChangingPassword ? 'Cancel Password Change' : 'Change Password'}
        </button>

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

// --- Components
const FormGroup = ({ label, icon, value, name, onChange, isEditing = true, isTextarea = false, isPassword = false }) => {
  return (
    <div style={formGroup}>
      <label style={labelStyle}>{icon} {label}:</label>
      {isEditing ? (
        isTextarea ? (
          <Textarea name={name} value={value} onChange={onChange} style={textareaStyle} />
        ) : (
          <Input type={isPassword ? 'password' : 'text'} name={name} value={value} onChange={onChange} style={inputStyle} />
        )
      ) : (
        <p style={viewStyle}>{value || `No ${label.toLowerCase()} provided`}</p>
      )}
    </div>
  );
};

const Input = ({ type, name, value, onChange, style }) => {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      style={{ ...style, ...(focused ? inputFocusStyle : {}), backgroundColor: '#FFF6E5' }}
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

// --- Styles
const pageWrapper = { display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px' };
const formContainer = {
  backgroundColor: '#371D10',
  padding: '40px',
  borderRadius: '12px',
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '20px',
  color: 'white',
  width: '90%',
  maxWidth: '450px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
};
const formGroup = { display: 'flex', flexDirection: 'column' };
const labelStyle = {
  marginBottom: '6px',
  fontWeight: '600',
  fontSize: '15px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};
const inputStyle = {
  padding: '12px 16px',
  border: '2px solid #333',
  borderRadius: '8px',
  fontSize: '16px',
  color: '#333',
  backgroundColor: '#FFF6E5',
  width: '100%',
  minWidth: '300px',
  minHeight: '48px',
  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
};
const inputFocusStyle = {
  borderColor: '#2196F3',
  boxShadow: '0 0 8px rgba(33, 150, 243, 0.6)',
  outline: 'none',
};
const textareaStyle = { ...inputStyle, minHeight: '100px', resize: 'vertical' };
const viewStyle = { padding: '10px', fontSize: '16px', backgroundColor: '#FFF6E5', borderRadius: '6px', color: '#333' };
const buttonStyle = { padding: '10px 16px', fontSize: '16px', borderRadius: '6px', color: 'white', border: 'none', cursor: 'pointer' };
const editButtonStyle = { ...buttonStyle, backgroundColor: '#6F4E37' }; // coffee brown
const saveButtonStyle = { ...buttonStyle, backgroundColor: '#A0522D' }; // sienna brown
const centeredMessage = { textAlign: 'center', fontSize: '18px', marginTop: '100px' };

export default Profile;
