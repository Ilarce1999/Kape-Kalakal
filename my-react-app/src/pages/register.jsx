import React, { useState, useEffect } from 'react';
import {
  Form,
  redirect,
  useNavigation,
  useActionData,
  Link,
} from 'react-router-dom';
import customFetch from '../../../utils/customFetch.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ACTION FUNCTION
export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    const response = await customFetch.post('/auth/register', data);

    if (response.status === 201) {
      // ✅ Redirect with success query param
      return redirect('/login?success=true');
    }
  } catch (error) {
    return {
      error: error?.response?.data?.msg || 'Something went wrong. Please try again.',
    };
  }
};

// COMPONENT
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [hover, setHover] = useState(false);

  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === 'submitting';

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);

  const styles = {
    wrapper: {
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg,rgb(77, 34, 14), #8B4513)',
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
      cursor: isSubmitting ? 'not-allowed' : 'pointer',
      marginTop: '10px',
      opacity: isSubmitting ? 0.7 : 1,
      transition: 'background-color 0.3s ease, opacity 0.3s ease',
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
      <Form method="post" style={styles.card}>
        <h2 style={styles.title}>Create an Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={name}
          style={styles.input}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          style={styles.input}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={password}
          style={styles.input}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          name="location"
          placeholder="Enter your location"
          value={location}
          style={styles.input}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button
          type="submit"
          style={styles.button}
          disabled={isSubmitting}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
        <div style={styles.registerText}>
          Already have an account?
          <Link to="/login" style={styles.registerLink}>
            Log in
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default Register;
