import React, { useState } from 'react';
import { useNavigate, useLocation, useLoaderData, redirect } from 'react-router-dom';
import customFetch from '../../../utils/customFetch';

export const loader = async () => {
  try {
    const { data } = await customFetch.get('/users/current-user');
    return data;
  } catch (error) {
    return redirect('/');
  }
};

const styles = {
  wrapper: {
    marginTop: '50px',
    padding: '40px 30px',
    backgroundColor: '#2c1b0b',
    color: 'white',
    minHeight: '80vh',
    fontFamily: "'Playfair Display', serif",
  },
  section: {
    backgroundColor: '#5a3b22',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#FFD700',
    marginBottom: '10px',
  },
  paragraph: {
    fontSize: '1rem',
    lineHeight: '1.6',
  },
};

const Settings = () => {
  const { user } = useLoaderData();
  const navigate = useNavigate();

  return (
    <div style={styles.wrapper}>
      <h2 style={{ fontSize: '2rem', color: '#FFD700', marginBottom: '30px' }}>
        Account & Policies
      </h2>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>User Information</h3>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Terms & Conditions</h3>
        <p style={styles.paragraph}>
          By using Kape Kalakal, you agree to abide by all terms and conditions of use.
          We reserve the right to update these terms at any time. Continued use of the service
          constitutes acceptance of those changes.
        </p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Privacy Policy</h3>
        <p style={styles.paragraph}>
          We take your privacy seriously. Your personal data is stored securely and will not be
          shared with third parties without your consent, except as required by law.
        </p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Support</h3>
        <p style={styles.paragraph}>
          For help with your account, orders, or other concerns, please contact our customer service:
          <br />
          <strong>Email:</strong> support@kapekalakal.com
          <br />
          <strong>Phone:</strong> +63 912 345 6789
        </p>
      </div>
    </div>
  );
};

export default Settings;
