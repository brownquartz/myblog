// src/App.js
 import { Routes, Route, Navigate } from 'react-router-dom';
 import Layout     from './components/layout/Layout';
 import PostsList  from './pages/PostsList';
 import PostDetail from './pages/PostDetail';
 import Login      from './pages/Login';

 export default function App() {
   return (
       <Routes>
         <Route path="/login" element={<Login />} />
         {/* Layout を使うルート */}
         <Route path="/" element={<Layout />}>
           <Route index        element={<Navigate to="" replace />} />
           <Route path="posts" element={<PostsList />} />
           <Route path="posts/:id" element={<PostDetail />} />
         </Route>
       </Routes>
   );
 }
