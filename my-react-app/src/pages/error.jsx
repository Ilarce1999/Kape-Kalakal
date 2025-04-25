import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#F5DEB3',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "'Playfair Display', serif",
      color: '#8B4513',
      textAlign: 'center',
      padding: '0 20px'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p style={{ fontStyle: 'italic', marginTop: '10px' }}>
        {error.statusText || error.message}
      </p>
      <Link to="/" style={{
        marginTop: '30px',
        padding: '12px 24px',
        backgroundColor: '#8B4513',
        color: 'white',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: 'bold'
      }}>
        Go back home
      </Link>
    </div>
  );
};

export default ErrorPage;
