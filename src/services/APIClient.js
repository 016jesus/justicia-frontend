import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://proyecto-justiconsulta.onrender.com',
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': 'APP-CLIENT-a20ceb8b-b6c3-4620-a560-45c39746a30c' 
  },
  timeout: 60000,
});

apiClient.interceptors.request.use(
  (config) => {
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
      // Attach Authorization header from localStorage if present
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // prefer existing header if already set
          if (!config.headers) config.headers = {};
          config.headers.Authorization = config.headers.Authorization || `Bearer ${token}`;
        }
      } catch (e) {
        // ignore localStorage failures
        console.warn('No se pudo leer token de localStorage en interceptor', e);
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