// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PostsList from './pages/PostsList';
import PostDetail from './pages/PostDetail';
import Home from './pages/Home';

export default function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <main style={{ flex: 1, padding: '2rem' }}>
          <Routes>
            {/* ホーム画面 */}
            <Route path="/" element={<Home />} />

            {/* Posts一覧 */}
            <Route path="/posts" element={<PostsList />} />

            {/* 個別記事詳細 (/posts/:id) */}
            <Route path="/posts/:id" element={<PostDetail />} />

            {/* 存在しないパスへのフォールバック（ホームに戻すなど） */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
