import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAPI } from '../features/auth/services/AuthAPI.js';
import apiClient from '../services/APIClient';
import { clearNamespace } from '../services/DataCache';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });
  const navigate = useNavigate();
 
  // Declarar fetchUserByEmail PRIMERO para que login pueda usarlo
  const fetchUserByEmail = useCallback(async (email) => {
    if (!email) return null;
    try {
      const response = await apiClient.post('/api/users/by-email', { email });
      const userData = response.data;
      setUser(userData);
      try {
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (e) {
        console.warn('No se pudo guardar user en localStorage', e);
      }
      return userData;
    } catch (err) {
      console.error('Error al obtener user por email:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedEmail = localStorage.getItem('email');
    if (storedToken) {
      setToken(storedToken);
      // ensure apiClient sends the token on subsequent requests
      try {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (e) {
        console.warn('No se pudo setear Authorization header en apiClient', e);
      }
      if (storedEmail) {
        fetchUserByEmail(storedEmail).catch((e) => console.error('fetchUserByEmail error', e));
      }
    }
  }, [fetchUserByEmail]);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Enviando credenciales:', credentials);
      
      const responseData = await loginAPI(credentials);
      const receivedToken = responseData.token;
      
      if (receivedToken) {
        localStorage.setItem('token', receivedToken);
        // guardar email para poder recuperar datos de usuario
        if (credentials && credentials.email) {
          localStorage.setItem('email', credentials.email);
        }
        setToken(receivedToken);
        // configure apiClient to include Authorization header for subsequent requests
        try {
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
        } catch (e) {
          console.warn('No se pudo setear Authorization header en apiClient', e);
        }
        // intentar cargar datos del usuario
        if (credentials && credentials.email) {
          try {
            await fetchUserByEmail(credentials.email);
          } catch (err) {
            console.warn('No se pudo obtener datos del usuario tras login', err);
          }
        }
        console.log('Login exitoso, token guardado:', receivedToken);
        navigate('/consultas');
      } else {
        throw new Error("El servidor no devolvió un token válido");
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError(err.message || 'Error durante el login');
    } finally {
      setLoading(false);
    }
  }, [navigate, fetchUserByEmail]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    try {
      delete apiClient.defaults.headers.common['Authorization'];
    } catch (e) {
      console.warn('No se pudo eliminar Authorization header en apiClient', e);
    }
    // clear cached data for current user namespace
    try { clearNamespace(); } catch (e) { /* ignore */ }
    navigate('/');
  }, [navigate]);

  const value = useMemo(() => ({ 
    token, 
    loading, 
    error, 
    login, 
    logout,
    user,
    fetchUserByEmail
  }), [token, loading, error, login, logout, user, fetchUserByEmail]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};
