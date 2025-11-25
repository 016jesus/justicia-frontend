import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_KEY, API_TIMEOUT } from '../config/constants';

// Normalize URL to remove trailing slashes
const normalizeUrl = (url) => {
  if (!url) return url;
  return url.replace(/\/+$/, '');
};

const apiClient = axios.create({
  baseURL: normalizeUrl(API_BASE_URL),
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': API_KEY
  },
  timeout: API_TIMEOUT,
});

// Debug mode - set to false in production
const DEBUG = __DEV__;

apiClient.interceptors.request.use(
  async (config) => {
    // Ensure headers object exists
    if (!config.headers) config.headers = {};
    
    // Ensure API Key is always present
    if (!config.headers['X-API-KEY']) {
      config.headers['X-API-KEY'] = API_KEY;
    }
    
    // Ensure Content-Type is set
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    // Do not attach Authorization for auth endpoints (login/register/reset)
    let isAuthEndpoint = false;
    try {
      const path = new URL(config.url, config.baseURL).pathname;
      if (/\/auth(\/|$)/.test(path)) isAuthEndpoint = true;
    } catch (e) {
      // fallback: check raw url string
      if (config.url && /(^|\/)auth(\/|$)/.test(config.url)) isAuthEndpoint = true;
    }

    if (!isAuthEndpoint) {
      // Attach Authorization header from AsyncStorage if present
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          if (DEBUG) console.log('🔐 Token agregado al header:', token.substring(0, 20) + '...');
        } else {
          if (DEBUG) console.warn('⚠️ No hay token en AsyncStorage');
        }
      } catch (e) {
        if (DEBUG) console.warn('❌ No se pudo leer token de AsyncStorage', e);
      }
    } else {
      // Remove Authorization header for auth endpoints
      delete config.headers.Authorization;
      if (config.headers.common) {
        delete config.headers.common.Authorization;
      }
      if (DEBUG) console.log('🔓 Endpoint de auth, sin token');
    }

    if (DEBUG) {
      console.log('📤 REQUEST:', {
        method: config.method?.toUpperCase(),
        url: config.baseURL + config.url,
        headers: config.headers,
        data: config.data
      });
    }
    
    return config;
  },
  (error) => {
    if (DEBUG) console.error('❌ Error en request:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    if (DEBUG) {
      console.log('✅ RESPONSE:', {
        status: response.status,
        url: response.config.url,
        data: response.data
      });
    }
    return response;
  },
  async (error) => {
    if (DEBUG) {
      console.error('❌ ERROR RESPONSE:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        data: error.response?.data,
        message: error.message,
        headers: error.response?.headers
      });
    }

    // Detectar token expirado: 403 con token presente
    if (error.response?.status === 403) {
      try {
        const token = await AsyncStorage.getItem('token');
        // Si hay token pero el servidor devuelve 403, el token expiró
        if (token && !error.config?.url?.includes('/auth')) {
          console.warn('🚨 Sesión expirada - Token inválido');
          
          // Limpiar datos de sesión
          await AsyncStorage.multiRemove(['token', 'user', 'email']);
          
          // Mostrar alerta
          const { Alert } = require('react-native');
          Alert.alert(
            'Sesión Expirada',
            'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
            [
              {
                text: 'Aceptar',
                onPress: () => {
                  // Emitir evento para que el AuthContext maneje la navegación
                  apiClient.sessionExpired = true;
                }
              }
            ]
          );
        }
      } catch (e) {
        console.error('Error verificando token expirado:', e);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
