import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, Form, redirect, useNavigation } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import customFetch from '../../../utils/customFetch.js';

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    const response = await customFetch.post('/auth/login', data);
    toast.success('Login successful');

    // Ensure correct redirection
    return redirect('/dashboard');
  } catch (error) {
    toast.error(error?.response?.data?.msg || 'Login failed');
    return { error: error?.response?.data?.msg || 'Login failed' };
  }
};

const Login = () => {
  const [hover, setHover] = useState(false);
  const location = useLocation();
  const toastShown = useRef(false);

  // Use useNavigation to track the form submission state
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get('success') === 'true' && !toastShown.current) {
      // Optionally show a registration success message here
      toastShown.current = true;
    }
  }, [location]);

  const styles = {
    wrapper: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #A0522D, #8B4513)' },
    card: { backgroundColor: '#fffaf0', padding: '40px', borderRadius: '15px', boxShadow: '0 8px 16px rgba(0,0,0,0.2)', width: '100%', maxWidth: '400px' },
    title: { textAlign: 'center', marginBottom: '20px', color: '#5C4033', fontSize: '1.8rem', fontWeight: 'bold' },
    input: { width: '100%', padding: '12px 15px', margin: '10px 0', border: '1px solid #ccc', borderRadius: '8px', fontSize: '1rem' },
    button: { width: '100%', padding: '12px', backgroundColor: hover ? '#A0522D' : '#8B4513', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', marginTop: '10px', transition: 'background-color 0.3s ease' },
    registerText: { marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' },
    registerLink: { color: '#8B4513', textDecoration: 'none', fontWeight: 'bold', marginLeft: '5px' },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.title}>Login</div>
        <Form method="post"> 
          <input name="email" type="email" placeholder="Email" style={styles.input} required />
          <input name="password" type="password" placeholder="Password" style={styles.input} required />
          <button
            type="submit"
            disabled={isSubmitting}
            style={hover ? { ...styles.button } : styles.button}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {isSubmitting ? 'Submitting...' : 'Login'}
          </button>
        </Form>
        <div style={styles.registerText}>
          Don’t have an account?
          <Link to="/register" style={styles.registerLink}>Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
