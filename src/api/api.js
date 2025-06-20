// src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // package.json の "proxy": "http://localhost:4000" が効く
  headers: { 'Content-Type': 'application/json' }
});

export default api;
