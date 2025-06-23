// src/components/layout/Header.js
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Header.css';

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const toggleMenu = () => setOpen(o => !o);
  const closeMenu = () => setOpen(false);

  return (
    <>
      <header className="header">
        {/* 左：ハンバーガー */}
        <button className="hamburger" onClick={toggleMenu}>☰</button>

        {/* 中央：ロゴ */}
        <h1 className="header-logo">
          <Link to="/" onClick={closeMenu}>my-blog</Link>
        </h1>

        {/* 右：Login / Logout */}
        <div className="header-auth">
          {user ? (
            <button className="auth" onClick={logout}>
              Logout
            </button>
          ) : (
            <Link to="/login" onClick={closeMenu}>
              <button className="auth">Login</button>
            </Link>
          )}
        </div>
      </header>

      {/* オーバーレイ */}
      <div
        className={`overlay${open ? ' open' : ''}`}
        onClick={closeMenu}
      />

      {/* サイドメニュー */}
      <nav className={`side-menu${open ? ' open' : ''}`}>
        <ul className="menu-list">
          <li><Link to="/"      onClick={closeMenu}>Home</Link></li>
          <li><Link to="/posts" onClick={closeMenu}>Posts</Link></li>
          <li><Link to="/about" onClick={closeMenu}>About</Link></li>
        </ul>
      </nav>
    </>
  );
}
