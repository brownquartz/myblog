// src/components/layout/Header.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

export default function Header() {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/'); // ログアウト後はホームへ
  };

  return (
    <header className="header" style={{ padding: '1rem 2rem', borderBottom: '1px solid #ddd' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>my-blog</Link>
        </div>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: '1rem' }}>{user.email} ({user.role})</span>
              <button onClick={onLogout}>ログアウト</button>
            </>
          ) : (
            <Link to="/login">ログイン</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
