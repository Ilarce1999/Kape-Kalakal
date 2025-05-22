import React from 'react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#5a3b22',
        color: 'white',
        padding: '40px 20px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          padding: '0 20px',
        }}
      >
        <div style={{ flex: '1 1 250px', margin: '10px' }}>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
            Customer Service
          </h4>
          <p>Need help? Our team is here for you 24/7.</p>
          <p>FAQs</p>
          <p>Returns & Refunds</p>
          <p>Order Tracking</p>
        </div>
        <div style={{ flex: '1 1 250px', margin: '10px' }}>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
            Contact Us
          </h4>
          <p>Email: support@kapekalakal.com</p>
          <p>Phone: +63 912 345 6789</p>
          <p>Address: 123 Brew Street, Makati, PH</p>
        </div>
        <div style={{ flex: '1 1 250px', margin: '10px' }}>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
            About Us
          </h4>
          <p>
            Kape Kalakal is your go-to café for premium Filipino coffee blends.
            We're passionate about coffee and community.
          </p>
          <p>Read Our Story</p>
        </div>
      </div>
      <div style={{ marginTop: '20px' }}>
        <p>© 2025 Kape Kalakal. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
