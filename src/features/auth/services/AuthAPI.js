import apiClient from '../../../services/APIClient';

export const loginAPI = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error en loginAPI:', error);
    }
    
    if (error.response) {
      throw new Error(error.response.data.message || 'Error en las credenciales');
    } else if (error.request) {
      throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
    } else {
      throw new Error('Error de configuración: ' + error.message);
    }
  }
};