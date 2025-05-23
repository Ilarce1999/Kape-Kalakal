import React, { useState, useEffect } from 'react';
import { Outlet, redirect, useLoaderData, useLocation } from 'react-router-dom';
import customFetch from '../../../utils/customFetch.js';

export const loader = async () => {
  try {
    const { data } = await customFetch.get('/users/current-user');
    if (data.user.role !== 'admin') {
      return redirect('/dashboard');
    }
    return data;
  } catch (error) {
    return redirect('/login');
  }
};

const Admin = () => {
  const { user } = useLoaderData();
  const location = useLocation();
  const isHome = location.pathname === '/admin';

  // Dashboard data
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    bestProduct: '',
    totalOrders: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await customFetch.get('/admin/dashboard');
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    if (isHome) {
      fetchDashboardData();
    }
  }, [isHome]); // Fetch data only on the admin home page

  return (
    <div style={{ padding: '20px', fontFamily: "'Playfair Display', serif", minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {isHome && (
        <>
          {/* Welcome Admin Section with a different background color */}
          <div
            style={{
              backgroundColor: '#f1f8ff',
              borderRadius: '10px',
              padding: '30px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              marginBottom: '40px',
              marginTop: '90px',
            }}
          >
            <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>
              Welcome, {user?.name || 'Admin'}!
            </h1>
            <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
              You're logged in as an <strong>Admin</strong>.
            </p>
            <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
              Use the navigation above to manage products, orders, and more.
            </p>
          </div>

          {/* Admin Dashboard Section with a different background color */}
          <div
            style={{
              backgroundColor: '#e9f7fa', // Light cyan background for the dashboard
              borderRadius: '10px',
              padding: '30px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            }}
          >
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>
              Dashboard Overview
            </h2>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '20px',
                fontSize: '1.1rem',
              }}
            >
              <div
                style={{
                  backgroundColor: '#4CAF50', // Green for users
                  padding: '20px',
                  borderRadius: '10px',
                  width: '30%',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  color: 'white',
                }}
              >
                <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>
                  Total Users
                </h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {dashboardData.totalUsers}
                </p>
              </div>
              <div
                style={{
                  backgroundColor: '#FF9800', // Orange for best product
                  padding: '20px',
                  borderRadius: '10px',
                  width: '30%',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  color: 'white',
                }}
              >
                <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>
                  Best Selling Product
                </h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {dashboardData.bestProduct || 'No data available'}
                </p>
              </div>
              <div
                style={{
                  backgroundColor: '#2196F3', // Blue for total orders
                  padding: '20px',
                  borderRadius: '10px',
                  width: '30%',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  color: 'white',
                }}
              >
                <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>
                  Total Orders
                </h3>
                <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {dashboardData.totalOrders}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <Outlet />
    </div>
  );
};

export default Admin;
