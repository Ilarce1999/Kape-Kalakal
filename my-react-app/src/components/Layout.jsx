import React from 'react';
import Navbar from './navbar';
import Footer from './footer';
import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <Outlet/>
      <Footer/>

    </>
  );
};

export default Layout;
