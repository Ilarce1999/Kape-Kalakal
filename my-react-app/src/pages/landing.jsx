import React from 'react';
import { Form, Outlet, useLocation } from 'react-router-dom';

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url("/images/background.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    padding: '20px',
  },
  card: {
    backgroundColor: 'hsl(40, 69.20%, 56.70%)',
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
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#8B4513',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
};

const LandingPage = () => {
  const location = useLocation();

  // If the user is not on the root path, show only the nested page
  const isRoot = location.pathname === '/';

  return (
    <div style={styles.wrapper}>
      {isRoot ? (
        <div style={styles.card}>
          <h2 style={styles.title}>Welcome to Kape Kalakals</h2>
          <Form method="get" action="/register">
            <button type="submit" style={styles.button}>Register</button>
          </Form>
          <Form method="get" action="/login">
            <button type="submit" style={styles.button}>Login</button>
          </Form>
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default LandingPage;
