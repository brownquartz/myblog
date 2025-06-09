// src/App.js
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout    from './components/layout/Layout'
import Home      from './pages/Home'        // もしあれば
import PostsList from './pages/PostsList'
import PostDetail from './pages/PostDetail'
import PostForm   from './pages/PostForm'   // 新規/編集フォーム（必要なら）

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/"               element={<PostsList />} />
          <Route path="/posts"          element={<PostsList />} />
          <Route path="/posts/:id"      element={<PostDetail />} />
          <Route path="/posts/new"      element={<PostForm />} />
          <Route path="/posts/:id/edit" element={<PostForm />} />
          {/* 必要に応じて Home, 404 などを追加 */}
        </Routes>
      </Layout>
    </Router>
  )
}
