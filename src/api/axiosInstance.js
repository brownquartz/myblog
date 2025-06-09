// src/api/axiosInstance.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',  // package.json の proxy: http://localhost:4000 が効く
  headers: { 'Content-Type': 'application/json' }
});

// リクエスト前に必ず token を載せる
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

export default api;
