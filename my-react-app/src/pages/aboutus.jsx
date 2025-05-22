import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useLoaderData, redirect } from 'react-router-dom';
import customFetch from '../../../utils/customFetch';
import { toast } from 'react-toastify';

export const loader = async () => {
  try {
    const { data } = await customFetch.get('/users/current-user');
    return data;
  } catch (error) {
    return redirect('/');
  }
};

const AboutUs = () => {
  const styles = {
    contentWrapper: {
      padding: '40px 30px',
      backgroundColor: '#2c1b0b',
      color: 'white',
      fontFamily: "'Playfair Display', serif",
    },
    row: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      marginBottom: '60px',
    },
    rowReverse: {
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'row-reverse',
      alignItems: 'center',
    },
    textCol: {
      flex: '1 1 50%',
      padding: '0 30px',
      minWidth: '300px',
    },
    image: {
      width: '100%',
      borderRadius: '12px',
      objectFit: 'cover',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      maxHeight: '400px',
    },
    imageWithMargin: {
      marginTop: '80px', // <-- Prevent image from being hidden by navbar
    },
    title: {
      fontSize: '2rem',
      color: '#FFD700',
      marginBottom: '20px',
    },
    paragraph: {
      fontSize: '1.1rem',
      lineHeight: '1.8',
    },
  };

  return (
    <div style={styles.contentWrapper}>
      <div style={styles.row}>
        <div style={styles.textCol}>
          <h2 style={styles.title}>Welcome to Kape Kalakal</h2>
          <p style={styles.paragraph}>
            Kape Kalakal is not just your typical coffee hub—it's a celebration of Filipino craftsmanship.
            Our mission is to serve quality coffee while uplifting local farmers and artisans.
            Each cup brewed is rooted in community and sustainability, giving you more than just a caffeine fix.
          </p>
        </div>
        <div style={styles.textCol}>
          <img
            src="/images/Kapeng_Barako.jpg"
            alt="Kape Kalakal Storefront"
            style={{ ...styles.image, ...styles.imageWithMargin }}
          />
        </div>
      </div>

      <div style={styles.rowReverse}>
        <div style={styles.textCol}>
          <h2 style={styles.title}>Supporting Local, Brewing Excellence</h2>
          <p style={styles.paragraph}>
            From Barako beans in Batangas to Kape Alamid in Mindanao, we carefully curate our blends
            to bring the best of Philippine flavors into every sip. Whether you’re here for a quick espresso
            or a long conversation over iced latte, you’re always part of the Kape Kalakal family.
          </p>
        </div>
        <div style={styles.textCol}>
          <img
            src="/images/barako_beans.jpg"
            alt="Kape Kalakal Beans"
            style={styles.image}
          />
        </div>
      </div>
    </div>
  );
};


export default AboutUs;