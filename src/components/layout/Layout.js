// src/components/layout/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <>
      <Header />

      {/* Outlet が /posts で PostsList を表示 */}
      <main>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
