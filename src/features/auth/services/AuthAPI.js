import apiClient from '../../../services/APIClient';

export const loginAPI = async (credentials) => {
  try {
    console.log('Enviando login a:', `${process.env.REACT_APP_API_URL}/auth/login`);
    console.log('Credenciales:', credentials);
    console.log('API Key:', 'APP-CLIENT-a20ceb8b-b6c3-4620-a560-45c39746a30c');
    
    const response = await apiClient.post('/auth/login', credentials);
    console.log('Login exitoso:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en loginAPI:', error);
    
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error status:', error.response.status);
      throw new Error(error.response.data.message || 'Error en las credenciales');
    } else if (error.request) {
      console.error('No hubo respuesta del servidor');
      throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
    } else {
      console.error('Error de configuración:', error.message);
      throw new Error('Error de configuración: ' + error.message);
    }
  }
};