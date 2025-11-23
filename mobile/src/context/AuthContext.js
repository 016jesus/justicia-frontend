import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../services/APIClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children, navigation }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const storedEmail = await AsyncStorage.getItem('email');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedToken) {
        setToken(storedToken);
        // ensure apiClient sends the token on subsequent requests
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        if (storedEmail && !storedUser) {
          fetchUserByEmail(storedEmail).catch((e) => 
            console.error('fetchUserByEmail error', e)
          );
        }
      }
    } catch (e) {
      console.error('Error loading stored auth:', e);
    }
  };

  const login = async (credentials, navigate) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Enviando credenciales:', credentials);
      
      // Call login API
      const response = await apiClient.post('/api/auth/login', credentials);
      const responseData = response.data;
      const receivedToken = responseData.token;
      
      if (receivedToken) {
        await AsyncStorage.setItem('token', receivedToken);
        
        // Save email to be able to recover user data
        if (credentials && credentials.email) {
          await AsyncStorage.setItem('email', credentials.email);
        }
        
        setToken(receivedToken);
        
        // Configure apiClient to include Authorization header for subsequent requests
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
        
        // Try to load user data
        if (credentials && credentials.email) {
          try {
            await fetchUserByEmail(credentials.email);
          } catch (err) {
            console.warn('No se pudo obtener datos del usuario tras login', err);
          }
        }
        
        console.log('Login exitoso, token guardado:', receivedToken);
        
        // Navigate to main screen
        if (navigate) {
          navigate('ProcessConsultation');
        }
      } else {
        throw new Error("El servidor no devolvió un token válido");
      }
    } catch (err) {
      console.error('Error en login:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error durante el login';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserByEmail = async (email) => {
    if (!email) return null;
    try {
      const response = await apiClient.post('/api/users/by-email', { email });
      const userData = response.data;
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      console.error('Error al obtener user por email:', err);
      throw err;
    }
  };

  const logout = async (navigate) => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('email');
      await AsyncStorage.removeItem('user');
      setToken(null);
      setUser(null);
      delete apiClient.defaults.headers.common['Authorization'];
      
      // Navigate to login screen
      if (navigate) {
        navigate('Login');
      }
    } catch (e) {
      console.error('Error during logout:', e);
    }
  };

  const value = { 
    token, 
    loading, 
    error, 
    login, 
    logout,
    user,
    fetchUserByEmail,
    isAuthenticated: !!token
  };

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
