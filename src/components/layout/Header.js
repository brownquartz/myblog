// src/components/layout/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen(o => !o);
  const closeMenu = () => setOpen(false);

  return (
    <>
      <header className="header">
        {/* 左：ハンバーガー */}
        <button className="hamburger" onClick={toggleMenu}>☰</button>

        {/* 中央：ロゴ */}
        <h1><Link to="/">my-blog</Link></h1>

        {/* 右：Login/Logout */}
        <div className="header-auth">
          <button className="auth">Login</button>
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
          <li><Link to="/"       onClick={closeMenu}>Home</Link></li>
          <li><Link to="/posts"  onClick={closeMenu}>Posts</Link></li>
          <li><Link to="/about"  onClick={closeMenu}>About</Link></li>
        </ul>
      </nav>
    </>
  );
}
