 import React, { useEffect, useState, useContext } from 'react';
 import api from '../api/api';
 import { useNavigate } from 'react-router-dom';
 import { AuthContext } from '../contexts/AuthContext';

 export default function PostsList() {
   const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(true);
   const { logout } = useContext(AuthContext);
   const navigate = useNavigate();

   useEffect(() => {
     api.get('/posts')
       .then(res => setPosts(res.data))
       .catch(err => {
         console.error('PostsList error:', err.response?.data || err.message);
         if (err.response?.status === 401) {
           alert('セッション切れです。再度ログインしてください。');
           logout();
           navigate('/login');
         }
       })
       .finally(() => setLoading(false));
   }, [navigate, logout]);

   if (loading) return <div>Loading…</div>;
   return (
     <ul>
       {posts.map(p => <li key={p.id}>{p.title}</li>)}
     </ul>
   );
 }
