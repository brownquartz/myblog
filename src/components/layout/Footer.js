// src/components/layout/Footer.js
import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <hr />
      © {new Date().getFullYear()} my-blog
    </footer>
  );
}
