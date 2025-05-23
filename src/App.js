import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
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
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<PostsList />} />
            {/* /posts/1 などの詳細ページ */}
            <Route path="/posts/:slug" element={<PostDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}