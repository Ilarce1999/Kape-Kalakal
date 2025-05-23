import React from 'react';
import Navbar from './NavBar';
import Footer from '../../../components/footer';
import { Outlet } from 'react-router-dom';

const SuperAdminLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Outlet/>
      <Footer/>

    </>
  );
};

export default SuperAdminLayout;
