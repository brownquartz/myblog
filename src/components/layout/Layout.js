// src/components/layout/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './Layout.css'; // もしスタイルを分けたいなら

export default function Layout() {
  return (
    <>
      <Header />
      <main style={{ marginTop: '1rem', minHeight: '70vh' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
