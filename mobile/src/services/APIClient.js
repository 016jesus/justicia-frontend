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
    // Do not attach Authorization for auth endpoints (login/register/reset)
    let skipAttach = false;
    try {
      const path = new URL(config.url, config.baseURL).pathname;
      if (/\/auth(\/|$)/.test(path)) skipAttach = true;
    } catch (e) {
      // fallback: check raw url string
      if (config.url && /(^|\/)auth(\/|$)/.test(config.url)) skipAttach = true;
    }

    if (!skipAttach) {
      // Attach Authorization header from AsyncStorage if present
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          // prefer existing header if already set
          if (!config.headers) config.headers = {};
          config.headers.Authorization = config.headers.Authorization || `Bearer ${token}`;
        }
      } catch (e) {
        // ignore AsyncStorage failures
        console.warn('No se pudo leer token de AsyncStorage en interceptor', e);
      }
    } else {
      // If this is an auth endpoint, ensure we REMOVE any Authorization header
      try {
        if (config && config.headers) {
          if (config.headers.Authorization) delete config.headers.Authorization;
          // also defensive: remove common if present
          if (config.headers.common && config.headers.common.Authorization) delete config.headers.common.Authorization;
        }
      } catch (e) {
        if (DEBUG) console.warn('No se pudo eliminar Authorization header para endpoint de auth', e);
      }
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
  (error) => {
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
    return Promise.reject(error);
  }
);

export default apiClient;
