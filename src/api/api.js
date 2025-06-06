// src/api/api.js の例
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',   // proxy を使っているならこれだけで OK
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
