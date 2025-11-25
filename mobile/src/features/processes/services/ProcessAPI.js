import apiClient from '../../../services/APIClient';

/**
 * Consultar proceso por número de radicación
 */
export const consultarProceso = async (radicacion) => {
  try {
    const pagina = Math.floor(Math.random() * 100) + 1;
    const response = await apiClient.get(
      `/api/legal-processes/${encodeURIComponent(radicacion)}?SoloActivos=false&pagina=${pagina}`
    );
    return response.data;
  } catch (error) {
    console.error('Error consultando proceso:', error);
    throw error;
  }
};

/**
 * Obtener detalle completo de un proceso
 */
export const obtenerDetalleProceso = async (idProceso) => {
  try {
    const response = await apiClient.get(`/api/legal-processes/${encodeURIComponent(idProceso)}/detail`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo detalle:', error);
    throw error;
  }
};

/**
 * Obtener sujetos procesales de un proceso
 */
export const obtenerSujetosProceso = async (idProceso) => {
  try {
    const response = await apiClient.get(`/api/legal-processes/${encodeURIComponent(idProceso)}/subjects`);
    return response.data?.sujetos || response.data || [];
  } catch (error) {
    console.error('Error obteniendo sujetos:', error);
    return [];
  }
};

/**
 * Obtener actuaciones de un proceso
 */
export const obtenerActuacionesProceso = async (idProceso) => {
  try {
    const response = await apiClient.get(`/api/legal-processes/${encodeURIComponent(idProceso)}/actuaciones`);
    return response.data?.actuaciones || response.data || [];
  } catch (error) {
    console.error('Error obteniendo actuaciones:', error);
    return [];
  }
};

/**
 * Obtener documentos de un proceso
 */
export const obtenerDocumentosProceso = async (idProceso) => {
  try {
    const response = await apiClient.get(`/api/legal-processes/${encodeURIComponent(idProceso)}/documents`);
    return response.data?.documentos || response.data || [];
  } catch (error) {
    console.error('Error obteniendo documentos:', error);
    return [];
  }
};

/**
 * Obtener historial de consultas
 */
export const obtenerHistorial = async () => {
  try {
    const response = await apiClient.get('/api/legal-processes/history');
    return response.data || [];
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    throw error;
  }
};

/**
 * Obtener mis procesos guardados
 */
export const obtenerMisProcesos = async () => {
  try {
    // Debug: verificar token antes de hacer la petición
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    const token = await AsyncStorage.getItem('token');
    console.log('🔑 Token disponible:', token ? 'Sí (' + token.substring(0, 20) + '...)' : 'NO');
    
    const response = await apiClient.get('/api/legal-processes');
    return response.data || [];
  } catch (error) {
    console.error('Error obteniendo mis procesos:', error);
    throw error;
  }
};

/**
 * Eliminar un proceso de mis procesos
 */
export const eliminarProceso = async (idProceso) => {
  try {
    await apiClient.delete(`/api/legal-processes/${encodeURIComponent(idProceso)}`);
    return true;
  } catch (error) {
    console.error('Error eliminando proceso:', error);
    throw error;
  }
};

/**
 * Guardar un proceso en mis procesos
 */
export const guardarProceso = async (idProceso) => {
  try {
    const response = await apiClient.post(`/api/legal-processes/${encodeURIComponent(idProceso)}`);
    return response.data;
  } catch (error) {
    console.error('Error guardando proceso:', error);
    throw error;
  }
};
