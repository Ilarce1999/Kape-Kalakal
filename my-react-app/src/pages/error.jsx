// Error.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Error = () => {
  const navigate = useNavigate(); // Initialize navigate hook

  // Function to navigate back to dashboard
  const handleGoBack = () => {
    navigate('/dashboard'); // Navigate to the dashboard
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: '#f8f8f8',
        textAlign: 'center',
        color: '#2c1b0b',
      }}
    >
      <h1 style={{ fontSize: '2rem', color: '#151BF4' }}>Something Went Wrong</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>Please try again later.</p>
      <button
        onClick={handleGoBack}
        style={{
          backgroundColor: '#2c1b0b',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default Error;
