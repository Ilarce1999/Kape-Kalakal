import React, { useState, useEffect } from 'react';
import { Outlet, redirect, useLoaderData, useLocation } from 'react-router-dom';
import customFetch from '../../../utils/customFetch.js';

export const loader = async () => {
  try {
    const { data } = await customFetch.get('/users/current-user');
    if (!data?.user || data.user.role !== 'admin') {
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

  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    bestProduct: null,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await customFetch.get('/users/admin/app-stats');
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setDashboardData({
          totalUsers: 'N/A',
          bestProduct: null,
          totalOrders: 'N/A',
        });
      } finally {
        setLoading(false);
      }
    };

    if (isHome) fetchDashboardData();
  }, [isHome]);

  return (
    <main
      style={{
        padding: '40px 60px',
        fontFamily: "'Playfair Display', serif",
        minHeight: '100vh',
        backgroundColor: '#2c1b0b',
      }}
    >
      {isHome && (
        <>
          {loading ? (
            <p style={{ fontSize: '1.3rem', marginTop: '120px', textAlign: 'center', color: '#5a3e1b' }}>
              Loading dashboard...
            </p>
          ) : (
            <>
              {/* Welcome Section */}
              <section
                style={{
                  backgroundColor: '#6f4e37', // Rich coffee brown
                  borderRadius: '12px',
                  padding: '40px',
                  boxShadow: '0 8px 20px rgba(111, 78, 55, 0.3)',
                  color: '#f3e9dc',
                  marginBottom: '60px',
                  textAlign: 'center',
                  marginTop: '70px',
                }}
              >
                <h1 style={{ fontSize: '2.8rem', marginBottom: '10px', fontWeight: '700' }}>
                  Welcome, {user?.name || 'Admin'}!
                </h1>
                <p style={{ fontSize: '1.3rem', fontWeight: '500', opacity: 0.9 }}>
                  You're logged in as an <strong>Admin</strong>.
                </p>
                <p style={{ fontSize: '1.1rem', marginTop: '12px', opacity: 0.8 }}>
                  Use the navigation above to manage products, orders, and more.
                </p>
              </section>

              {/* Dashboard Cards */}
              <section
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '30px',
                  maxWidth: '1100px',
                  margin: '0 auto',
                }}
              >
                {/* Total Users */}
                <article
                  style={{
                    flex: '1',
                    backgroundColor: '#d7bfae', // light mocha
                    borderRadius: '15px',
                    padding: '30px',
                    boxShadow: '0 6px 18px rgba(104, 76, 50, 0.25)',
                    textAlign: 'center',
                    color: '#4a2c11',
                    cursor: 'default',
                    transition: 'transform 0.2s ease-in-out',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', fontWeight: '600' }}>
                    Total Users
                  </h3>
                  <p style={{ fontSize: '6.5rem', fontWeight: '700' }}>{dashboardData.totalUsers}</p>
                </article>

                {/* Best Selling Product */}
                <article
                  style={{
                    flex: '1',
                    backgroundColor: '#FFFFFF', // warm cinnamon brown
                    borderRadius: '15px',
                    padding: '30px',
                    boxShadow: '0 6px 18px rgba(104, 76, 50, 0.3)',
                    textAlign: 'center',
                    color: '#4a2c11',
                    cursor: 'default',
                    transition: 'transform 0.2s ease-in-out',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', fontWeight: '600' }}>
                    Best Selling Product
                  </h3>
                  {dashboardData.bestProduct ? (
                    <>
                      <img
                        src={`http://localhost:5200/${dashboardData.bestProduct.image}`}
                        alt={dashboardData.bestProduct.name}
                        style={{
                          width: '120px',
                          height: '120px',
                          borderRadius: '16px',
                          objectFit: 'cover',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                          marginBottom: '20px',
                          border: '3px solid #f3e9dc',
                        }}
                      />
                      <p
                        style={{
                          fontSize: '1.4rem',
                          fontWeight: '700',
                          textShadow: '1px 1px 3px rgba(0,0,0,0.25)',
                        }}
                      >
                        {dashboardData.bestProduct.name}
                      </p>
                    </>
                  ) : (
                    <p style={{ fontSize: '1.1rem', fontStyle: 'italic' }}>No data available</p>
                  )}
                </article>

                {/* Total Orders */}
                <article
                  style={{
                    flex: '1',
                    backgroundColor: '#c9a66b', // golden caramel
                    borderRadius: '15px',
                    padding: '30px',
                    boxShadow: '0 6px 18px rgba(104, 76, 50, 0.25)',
                    textAlign: 'center',
                    color: '#4a2c11',
                    cursor: 'default',
                    transition: 'transform 0.2s ease-in-out',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '15px', fontWeight: '600' }}>
                    Total Orders
                  </h3>
                  <p style={{ fontSize: '6.5rem', fontWeight: '700' }}>{dashboardData.totalOrders}</p>
                </article>
              </section>
            </>
          )}
        </>
      )}
      <Outlet />
    </main>
  );
};

export default Admin;
