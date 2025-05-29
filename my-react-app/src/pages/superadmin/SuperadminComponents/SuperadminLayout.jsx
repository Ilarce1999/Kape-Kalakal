import React from 'react';
import Navbar from './NavBar';
import Footer from '../../../components/ooter';
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
