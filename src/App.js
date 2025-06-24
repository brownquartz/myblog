// src/App.js
import { Routes, Route, Navigate } from 'react-router-dom';
// import { AuthContext, AuthProvider } from '../contexts/AuthContext'
import Layout     from './components/layout/Layout';
import PostsList  from './pages/PostsList';
import PostForm    from './pages/PostForm';
import EditPost   from './pages/EditPost';
import PostDetail from './pages/PostDetail';
import Login      from './pages/Login';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* Layout を使うルート */}
      <Route path="/" element={<Layout />}>
        <Route index        element={<Navigate to="" replace />} />
        <Route path="posts">
          <Route index element={<PostsList />} />
          <Route path="new" element={<PostForm />} />
          <Route path=":id" element={<PostDetail />} />
          <Route path=":id/edit" element={<EditPost />} />
        </Route>
      </Route>
    </Routes>
  );
}
