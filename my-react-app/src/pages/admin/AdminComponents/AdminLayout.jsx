import React from 'react';
import Navbar from './NavBar';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Outlet/>
      <Footer/>

    </>
  );
};

export default AdminLayout;
