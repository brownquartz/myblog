// src/components/Header.js
import React, { useState } from 'react';
import './Header.css'; // CSSファイルをインポート

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="header">
        <button
          className="hamburger"
          onClick={() => setMenuOpen(true)}
          aria-label="メニューを開く"
        >
          &#9776;
        </button>
        <h1 style={{ margin: 0 }}>my-blog</h1>
      </header>

      {/* オーバーレイ */}
      <div
        className={menuOpen ? 'overlay open' : 'overlay'}
        onClick={() => setMenuOpen(false)}
      />

      {/* サイドメニュー */}
      <aside className={menuOpen ? 'side-menu open' : 'side-menu'}>
        <button
          onClick={() => setMenuOpen(false)}
          style={{
            marginBottom: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer'
          }}
          aria-label="メニューを閉じる"
        >
          ×
        </button>
        <nav>
          <ul className="menu-list">
            <li><a href="/">Home</a></li>
            <li><a href="/posts">Posts</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </aside>
    </>
  );
}