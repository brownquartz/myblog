// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/layout/Layout';
import Home from './pages/Home';
import PostsList from './pages/PostsList';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import NewPost from './pages/NewPost';
import EditPost from './pages/EditPost';
// など、他のページがあればインポート

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/posts" element={<PostsList />} />
          {/* /posts/:id で記事詳細 */}
          <Route path="/posts/:id" element={<PostDetail />} />

          {/* 管理者専用ページ（認証チェックは LoginContext などで行う） */}
          <Route path="/posts/new" element={<NewPost />} />
          <Route path="/posts/:id/edit" element={<EditPost />} />

          {/* 404: マッチしないものは Home に戻す or 404 ページ表示 */}
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
