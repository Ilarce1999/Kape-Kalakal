import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import customFetch from '../../../utils/customFetch.js';


export const action = async ({request}) => {
    return null;
    
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hover, setHover] = useState(false);
  const location = useLocation();
  const toastShown = useRef(false); // Ref to prevent multiple toasts

  // Only show the success toast if the "success" query param is in the URL
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get('success') === 'true' && !toastShown.current) {
      toast.success('Registration successful! You can now log in.');
      toastShown.current = true; // Set ref to true after showing the toast
    }
  }, [location]);

  const styles = {
    wrapper: {
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #A0522D, #8B4513)',
    },
    card: {
      backgroundColor: '#fffaf0',
      padding: '40px',
      borderRadius: '15px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
      width: '100%',
      maxWidth: '400px',
    },
    title: {
      textAlign: 'center',
      marginBottom: '20px',
      color: '#5C4033',
      fontSize: '1.8rem',
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      margin: '10px 0',
      border: '1px solid #ccc',
      borderRadius: '8px',
      fontSize: '1rem',
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: hover ? '#A0522D' : '#8B4513',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      cursor: 'pointer',
      marginTop: '10px',
      transition: 'background-color 0.3s ease',
    },
    registerText: {
      marginTop: '20px',
      textAlign: 'center',
      fontSize: '0.9rem',
    },
    registerLink: {
      color: '#8B4513',
      textDecoration: 'none',
      fontWeight: 'bold',
      marginLeft: '5px',
    },
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login:', email, password);
    // Add login logic here
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.title}>Login</div>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button
            type="submit"
            style={hover ? { ...styles.button, ...styles.buttonHover } : styles.button}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            Login
          </button>
        </form>
        <div style={styles.registerText}>
          Don’t have an account?
          <Link to="/register" style={styles.registerLink}>Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 
