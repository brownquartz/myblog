// src/components/layout/Layout.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';     // もともとあった Header コンポーネント
import Footer from './Footer'; // もともとあった Footer コンポーネント
import './Layout.css';  // サイドバーやヘッダー用の CSS をここで読み込む

export default function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <main className="layout__content">
        {children}
      </main>
      <Footer />
    </div>
  );
}
