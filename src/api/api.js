// src/api/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // http://localhost:4000/api
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // if you need cookies
});

export default api;
