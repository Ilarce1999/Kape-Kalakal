import React from 'react';
import Navbar from './NavBar';
import Footer from './Footer';
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
