import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_KEY, API_TIMEOUT } from '../config/constants';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': API_KEY
  },
  timeout: API_TIMEOUT,
});

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
        console.warn('No se pudo eliminar Authorization header para endpoint de auth', e);
      }
    }

    console.log('Enviando request a:', config.url);
    console.log('Headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('Error en request:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('Response exitoso:', response.status);
    return response;
  },
  (error) => {
    console.error('Error en response:', error);
    return Promise.reject(error);
  }
);

export default apiClient;
