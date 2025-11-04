import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navigations/Navbar';
import Footer from '../Navigations/Footer';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
