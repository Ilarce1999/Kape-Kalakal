import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      backgroundColor: '#8B4513',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1rem',
      cursor: 'pointer',
      marginTop: '10px',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#A0522D',
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

  const [hover, setHover] = useState(false);

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
