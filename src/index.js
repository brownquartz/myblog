// src/index.js
import React from 'react';
import { createRoot } from 'react-dom/client';  // ← react-dom/client からインポート
import App from './App';

const container = document.getElementById('root');
// createRoot(container) でルートをつくり…
const root = createRoot(container);
// そこに <App> をレンダーします
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
