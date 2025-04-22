import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hover, setHover] = useState(false);

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

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create an Account</h2>
        <input
          type="name"
          placeholder="Name"
          value={name}
          style={styles.input}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          style={styles.input}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          style={styles.input}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          style={styles.button}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          Register
        </button>
        <div style={styles.registerText}>
          Already have an account?
          <Link to="/login" style={styles.registerLink}>Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
