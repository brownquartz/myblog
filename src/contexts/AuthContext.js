// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

// 認証情報を格納する Context
export const AuthContext = createContext({
  user: null,      // { id, email, role } など
  token: null,     // JWT トークン文字列
  login: async () => {},
  logout: () => {},
  isAdmin: false
});

export const AuthProvider = ({ children }) => {
  // localStorage から既存の token を取得して初期化
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });

  // トークン／ユーザー情報が変わったら localStorage にも保存
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // ログイン関数
  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'ログインに失敗しました');
      }
      // data.token が返ってくる
      const jwt = data.token;
      // トークンを復号してユーザー情報を取り出す（簡易的に、payload 部分をデコードする）
      const base64Payload = jwt.split('.')[1];
      const payload = JSON.parse(atob(base64Payload));
      // payload = { id, email, role, iat, exp }
      setToken(jwt);
      setUser({ id: payload.id, email: payload.email, role: payload.role });
      return { success: true };
    } catch (err) {
      console.error('ログインエラー:', err);
      return { success: false, message: err.message };
    }
  };

  // ログアウト
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  // Context の値
  const value = { user, token, login, logout, isAdmin };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
