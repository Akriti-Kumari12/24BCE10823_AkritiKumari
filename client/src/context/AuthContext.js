import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('echoboard_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('echoboard_token');
    if (token) {
      api.get('/auth/me').then(res => {
        setUser(res.data);
        localStorage.setItem('echoboard_user', JSON.stringify(res.data));
      }).catch(() => logout()).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('echoboard_token', data.token);
    localStorage.setItem('echoboard_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (name, username, email, password) => {
    const { data } = await api.post('/auth/register', { name, username, email, password });
    localStorage.setItem('echoboard_token', data.token);
    localStorage.setItem('echoboard_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('echoboard_token');
    localStorage.removeItem('echoboard_user');
    setUser(null);
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem('echoboard_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
