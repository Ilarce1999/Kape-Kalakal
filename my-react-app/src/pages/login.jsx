import React, { useState, useEffect, useRef } from 'react';
import {
  Link,
  useLocation,
  Form,
  redirect,
  useNavigation,
  useActionData,
  useLoaderData,
} from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import customFetch from '../../../utils/customFetch.js';

// ✅ Loader: Redirect if already logged in
export const loader = async () => {
  try {
    const res = await customFetch.get('/users/current-user');
    const user = res.data.user;
    // Check if the logged-in user is an admin and redirect accordingly
    if (user?.role === 'admin') {
      return redirect('/admin'); // Admin dashboard
    }
    return redirect('/dashboard'); // Regular user dashboard
  } catch (err) {
    return null; // Not logged in, allow access to login page
  }
};

// ✅ Action: Handle login and redirect based on role
export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const errors = { msg: '' };

  // Validate password length
  if (data.password.length < 3) {
    errors.msg = 'Password too short';
    return errors;
  }

  try {
    const response = await customFetch.post('/auth/login', data);
    const user = response.data.user;

    console.log('User logged in:', user); // Log the user object for debugging

    toast.success('Login successful');

    // Redirect based on role
    if (user.role === 'admin') {
      console.log('Redirecting to admin dashboard');
      return redirect('/admin'); // Redirect admin to the admin dashboard
    }
    console.log('Redirecting to user dashboard');
    return redirect('/dashboard'); // Redirect regular users to the user dashboard
  } catch (error) {
    toast.error(error?.response?.data?.msg || 'Login failed');
    return { msg: error?.response?.data?.msg || 'Login failed' };
  }
};

// ✅ Login Component
const Login = () => {
  const [hover, setHover] = useState(false);
  const location = useLocation();
  const toastShown = useRef(false);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';
  const errors = useActionData(); // Handle errors returned from action

  // Handle success message when coming from register page
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (query.get('success') === 'true' && !toastShown.current) {
      toastShown.current = true;
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
    errorMessage: {
      color: 'red',
      fontSize: '0.9rem',
      textAlign: 'center',
      marginTop: '10px',
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.title}>Login</div>
        <Form method="post">
          {/* Display error message if exists */}
          {errors?.msg && <p style={styles.errorMessage}>{errors.msg}</p>}
          <input
            name="email"
            type="email"
            placeholder="Email"
            style={styles.input}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            style={styles.input}
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            style={styles.button}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {isSubmitting ? 'Submitting...' : 'Login'}
          </button>
        </Form>
        <div style={styles.registerText}>
          Don’t have an account?
          <Link to="/register" style={styles.registerLink}>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
